"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getLeads } from "@/modules/leads/services/leads-client";
import type {
  LeadSummary,
  PagedResult,
  SubmissionStatus,
} from "@/modules/leads/types";
import { LeadsFilters } from "@/modules/leads/components/leads-filters";
import { LeadsTable } from "@/modules/leads/components/leads-table";

const PAGE_SIZE = 20;

type ViewState = "loading" | "error" | "ready";

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

function LeadsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status =
    (searchParams.get("status") as SubmissionStatus | null) ?? undefined;
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [state, setState] = useState<ViewState>("loading");
  const [data, setData] = useState<PagedResult<LeadSummary> | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    getLeads({ status, from, to, page, pageSize: PAGE_SIZE })
      .then((result) => {
        if (active) {
          setData(result);
          setState("ready");
        }
      })
      .catch(() => {
        if (active) {
          setState("error");
        }
      });
    return () => {
      active = false;
    };
  }, [status, from, to, page, reloadKey]);

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    router.push(`/dashboard/leads?${params.toString()}`);
  }

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Revisa los prospectos capturados y valida el plan sugerido.
        </p>
      </div>

      <div className="mb-4">
        <LeadsFilters />
      </div>

      {state === "loading" && <ListSkeleton />}

      {state === "error" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No pudimos cargar los leads.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setState("loading");
              setReloadKey((key) => key + 1);
            }}
          >
            Reintentar
          </Button>
        </div>
      )}

      {state === "ready" && data && data.items.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No hay leads que coincidan con los filtros.
          </p>
        </div>
      )}

      {state === "ready" && data && data.items.length > 0 && (
        <>
          <LeadsTable leads={data.items} />
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {data.total} {data.total === 1 ? "lead" : "leads"} · página{" "}
              {data.page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.page <= 1}
                onClick={() => goToPage(data.page - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={data.page >= totalPages}
                onClick={() => goToPage(data.page + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default function LeadsPage() {
  // useSearchParams needs a Suspense boundary during static rendering.
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl flex-1 p-6">
          <ListSkeleton />
        </main>
      }
    >
      <LeadsView />
    </Suspense>
  );
}
