/** The authenticated user, as returned by the .NET API (camelCase over the wire). */
export interface AuthUser {
  id: string;
  email: string;
  /** Role claim value, e.g. "Doctor" | "Admin" | "Patient". */
  role: string;
}

/** Body of POST /api/v1/auth/login and /refresh. */
export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}
