export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
};

export type AuthUser = {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles: string[];
};

export type AuthState = {
  initialized: boolean;
  authenticated: boolean;
  tokens: AuthTokens | null;
  user: AuthUser | null;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type SignupInput = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
