"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { ApiError } from "@/shared/lib/api-client";
import { useAuth } from "@/modules/auth/context/auth-context";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GIS_SRC = "https://accounts.google.com/gsi/client";

/**
 * Renders Google's official Sign-In button (Google Identity Services, ID-token
 * flow) and exchanges the returned ID token for a session via the auth context.
 * The backend (`POST /api/v1/auth/google`) verifies the token and returns the
 * same session as a password login.
 *
 * Renders nothing when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is unset — password login
 * keeps working, the Google option is simply off.
 */
export function GoogleSignInButton() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // GIS registers the callback once; keep the latest handler in a ref so it
  // never fires a stale closure.
  const handleCredential = async (idToken: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle(idToken);
      router.replace("/dashboard");
    } catch (e) {
      setSubmitting(false);
      setError(
        e instanceof ApiError && e.status === 401
          ? "Google no pudo iniciar tu sesión. Verifica que tu cuenta esté registrada."
          : "No pudimos iniciar sesión con Google. Intenta de nuevo.",
      );
    }
  };
  const handlerRef = useRef(handleCredential);
  useEffect(() => {
    handlerRef.current = handleCredential;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!scriptReady || !GOOGLE_CLIENT_ID || !container || !window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => handlerRef.current(response.credential),
    });

    // Clear first so a re-run (e.g. Strict Mode double-invoke) can't stack buttons.
    container.innerHTML = "";
    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
      locale: "es",
      width: Math.min(container.offsetWidth || 320, 400),
    });
  }, [scriptReady]);

  // No client id configured → feature off; password login still works.
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Script
        src={GIS_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      {/* GIS renders the official button into this element. */}
      <div ref={containerRef} className="flex min-h-[40px] w-full justify-center" aria-busy={submitting} />
      {submitting && <p className="text-sm text-muted-foreground">Ingresando…</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
