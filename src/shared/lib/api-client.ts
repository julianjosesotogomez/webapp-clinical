/**
 * The single network client for webapp-clinical.
 *
 * This app talks to exactly ONE backend: the .NET MediCoreAI.Clinical API
 * (api/v1/auth, api/v1/leads). It never calls the Python intake service
 * (leads-clinical-ai) nor the database directly.
 *
 * The access token lives in memory (set by the auth module in Fase 4); the
 * refresh token travels only in an httpOnly cookie, so every request uses
 * `credentials: "include"`.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_CLINICAL_API_URL ?? "";

let accessToken: string | null = null;

/** Set (or clear) the in-memory access token. Called by the auth module. */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/** The current in-memory access token, if any. */
export function getAccessToken(): string | null {
  return accessToken;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions {
  /** Skip the automatic refresh-and-retry on a 401 (used by the auth endpoints themselves). */
  skipRefresh?: boolean;
}

// Silent refresh: the refresh token rides the httpOnly cookie, so a bare POST is enough.
async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      return false;
    }
    const data = (await res.json()) as { accessToken?: string };
    accessToken = data.accessToken ?? null;
    return accessToken !== null;
  } catch {
    return false;
  }
}

/**
 * Thin fetch wrapper around the .NET API: attaches the bearer token, always
 * sends the refresh cookie, and on a 401 tries a single silent refresh + retry.
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  options: ApiFetchOptions = {},
): Promise<T> {
  const send = (): Promise<Response> => {
    const headers = new Headers(init.headers);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(`${API_BASE_URL}${path}`, { ...init, headers, credentials: "include" });
  };

  let response = await send();

  if (response.status === 401 && !options.skipRefresh) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      response = await send();
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request to ${path} failed (${response.status}).`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
