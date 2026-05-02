import { http } from "./http";
import type { AuthTokens, LoginInput, SignupInput } from "../types/auth";

type AuthApiResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token?: string;
  scope?: string;
};

export function buildTokens(response: AuthApiResponse): AuthTokens {
  const now = Date.now();

  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    idToken: response.id_token,
    accessTokenExpiresAt: now + response.expires_in * 1000,
    refreshTokenExpiresAt: now + response.refresh_expires_in * 1000,
  };
}

export async function loginRequest(payload: LoginInput) {
  const response = await http.post<AuthApiResponse>("/auth/login", payload);
  return buildTokens(response.data);
}

export async function signupRequest(payload: SignupInput) {
  const response = await http.post<AuthApiResponse>("/auth/signup", payload);
  return buildTokens(response.data);
}

export async function refreshRequest(refreshToken: string) {
  const response = await http.post<AuthApiResponse>("/auth/refresh", { refreshToken });
  return buildTokens(response.data);
}

export async function logoutRequest(refreshToken: string) {
  await http.post("/auth/logout", { refreshToken });
}
