import { apiFetch, setAccessToken } from "@/shared/lib/api-client";
import type { AuthUser, LoginResponse } from "@/modules/auth/types/auth";

/** Logs in, stores the access token in memory, and returns the user. */
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch<LoginResponse>(
    "/api/v1/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    { skipRefresh: true }, // a 401 here means bad credentials, not an expired token
  );
  setAccessToken(res.accessToken);
  return res.user;
}

/**
 * Exchanges a Google ID token (from Google Identity Services) for a session,
 * exactly like {@link login}. The backend verifies the token, links it to an
 * existing account, and returns the same tokens.
 */
export async function googleLogin(idToken: string): Promise<AuthUser> {
  const res = await apiFetch<LoginResponse>(
    "/api/v1/auth/google",
    { method: "POST", body: JSON.stringify({ idToken }) },
    { skipRefresh: true }, // a 401 here means the token was rejected, not an expired session
  );
  setAccessToken(res.accessToken);
  return res.user;
}

/** Revokes the refresh-token family server-side and clears the in-memory token. */
export async function logout(): Promise<void> {
  try {
    await apiFetch<void>("/api/v1/auth/logout", { method: "POST" }, { skipRefresh: true });
  } finally {
    setAccessToken(null);
  }
}

/**
 * Resolves the current user from the session. On mount there is no in-memory
 * token, so the first call 401s and apiFetch silently refreshes from the cookie;
 * if there is no valid session this rejects and the caller treats it as logged out.
 */
export function currentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/v1/auth/current-user");
}
