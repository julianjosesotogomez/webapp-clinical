"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/modules/auth/context/auth-context";

function FullScreen({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-background p-6">
      <p className="text-sm text-muted-foreground">{children}</p>
    </main>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status, user, logout } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <FullScreen>Cargando…</FullScreen>;
  }

  if (status === "unauthenticated") {
    return null; // redirecting to /login
  }

  // Authenticated but not a doctor → no access to the clinical console.
  if (user?.role !== "Doctor") {
    return (
      <FullScreen>
        Acceso restringido: esta sección es solo para personal médico.
      </FullScreen>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <span className="text-sm font-semibold text-foreground">
            MediCoreAI · Panel clínico
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
