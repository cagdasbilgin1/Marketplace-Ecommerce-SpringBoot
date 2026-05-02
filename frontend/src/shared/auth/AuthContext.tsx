import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { loginRequest, logoutRequest, refreshRequest, signupRequest } from "../api/auth";
import { setAccessToken } from "./keycloak";
import type { AuthState, AuthTokens, AuthUser, LoginInput, SignupInput } from "../types/auth";

type AuthContextValue = AuthState & {
  loginUrl: string;
  signupUrl: string;
  login: (payload: LoginInput) => Promise<void>;
  signup: (payload: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

type StoredAuthSession = {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
  user?: AuthUser | null;
};

const authStorageKey = "marketplace-auth-session";

const initialState: AuthState = {
  initialized: true,
  authenticated: false,
  tokens: null,
  user: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseJwtPayload(token?: string): Record<string, unknown> | null {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = window.atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function mapUser(identityToken?: string, accessToken?: string): AuthUser | null {
  const payload = parseJwtPayload(identityToken) ?? parseJwtPayload(accessToken);
  if (!payload) {
    return null;
  }

  const realmAccess = payload.realm_access as { roles?: string[] } | undefined;
  const firstName = typeof payload.given_name === "string" ? payload.given_name : undefined;
  const lastName = typeof payload.family_name === "string" ? payload.family_name : undefined;
  const rawRoles = Array.isArray(realmAccess?.roles) ? realmAccess.roles : [];
  const roles = rawRoles.filter((role) => !role.startsWith("default-roles-") && role !== "offline_access" && role !== "uma_authorization");

  return {
    id: typeof payload.sub === "string" ? payload.sub : undefined,
    username: typeof payload.preferred_username === "string" ? payload.preferred_username : undefined,
    email: typeof payload.email === "string" ? payload.email : undefined,
    firstName,
    lastName,
    fullName:
      typeof payload.name === "string"
        ? payload.name
        : [firstName, lastName].filter(Boolean).join(" ") || undefined,
    roles,
  };
}

function readStoredSession(): StoredAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(authStorageKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    window.sessionStorage.removeItem(authStorageKey);
    return null;
  }
}

function persistSession(tokens: AuthTokens | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!tokens) {
    window.sessionStorage.removeItem(authStorageKey);
    return;
  }

  const storedSession: StoredAuthSession = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    idToken: tokens.idToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt,
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    user: mapUser(tokens.idToken, tokens.accessToken),
  };

  window.sessionStorage.setItem(authStorageKey, JSON.stringify(storedSession));
}

function clearSession() {
  persistSession(null);
  setAccessToken(null);
}

function createStateFromTokens(tokens: AuthTokens | null): AuthState {
  if (!tokens) {
    return initialState;
  }

  return {
    initialized: true,
    authenticated: true,
    tokens,
    user: mapUser(tokens.idToken, tokens.accessToken),
  };
}

function createStateFromStoredSession(): AuthState {
  const storedSession = readStoredSession();
  if (!storedSession) {
    return initialState;
  }

  const tokens: AuthTokens = {
    accessToken: storedSession.accessToken,
    refreshToken: storedSession.refreshToken,
    idToken: storedSession.idToken,
    accessTokenExpiresAt: storedSession.accessTokenExpiresAt,
    refreshTokenExpiresAt: storedSession.refreshTokenExpiresAt,
  };

  setAccessToken(tokens.accessToken);
  return {
    initialized: true,
    authenticated: true,
    tokens,
    user: storedSession.user ?? mapUser(tokens.idToken, tokens.accessToken),
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(() => createStateFromStoredSession());
  const refreshTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!state.authenticated || !state.tokens?.refreshToken) {
      if (refreshTimer.current) {
        window.clearInterval(refreshTimer.current);
        refreshTimer.current = null;
      }
      return;
    }

    refreshTimer.current = window.setInterval(() => {
      void refreshRequest(state.tokens!.refreshToken)
        .then((tokens) => {
          setAccessToken(tokens.accessToken);
          persistSession(tokens);
          setState(createStateFromTokens(tokens));
        })
        .catch((error) => {
          console.error("Token refresh failed", error);
          clearSession();
          setState(initialState);
        });
    }, 30_000);

    return () => {
      if (refreshTimer.current) {
        window.clearInterval(refreshTimer.current);
        refreshTimer.current = null;
      }
    };
  }, [state.authenticated, state.tokens]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      loginUrl: "/auth?mode=login",
      signupUrl: "/auth?mode=signup",
      login: async (payload) => {
        const tokens = await loginRequest(payload);
        setAccessToken(tokens.accessToken);
        persistSession(tokens);
        setState(createStateFromTokens(tokens));
      },
      signup: async (payload) => {
        const tokens = await signupRequest(payload);
        setAccessToken(tokens.accessToken);
        persistSession(tokens);
        setState(createStateFromTokens(tokens));
      },
      logout: async () => {
        const refreshToken = state.tokens?.refreshToken;
        clearSession();
        setState(initialState);

        if (refreshToken) {
          try {
            await logoutRequest(refreshToken);
          } catch (error) {
            console.error("Logout request failed", error);
          }
        }
      },
      refreshSession: async () => {
        if (!state.tokens?.refreshToken) {
          return false;
        }

        try {
          const tokens = await refreshRequest(state.tokens.refreshToken);
          setAccessToken(tokens.accessToken);
          persistSession(tokens);
          setState(createStateFromTokens(tokens));
          return true;
        } catch (error) {
          console.error("Manual refresh failed", error);
          clearSession();
          setState(initialState);
          return false;
        }
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
