"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ApiError } from "@/shared/lib/api-client";
import { getLead, getMedicalPlans } from "@/modules/leads/services/leads-client";
import { LeadDetailView } from "@/modules/leads/components/lead-detail";
import type { LeadDetail, MedicalPlan } from "@/modules/leads/types";

type ViewState = "loading" | "error" | "notfound" | "ready";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [state, setState] = useState<ViewState>("loading");
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [plans, setPlans] = useState<MedicalPlan[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getLead(id), getMedicalPlans().catch(() => [] as MedicalPlan[])])
      .then(([leadResult, planResult]) => {
        if (active) {
          setLead(leadResult);
          setPlans(planResult);
          setState("ready");
        }
      })
      .catch((error) => {
        if (active) {
          setState(
            error instanceof ApiError && error.status === 404
              ? "notfound"
              : "error",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 p-6">
      <Link
        href="/dashboard/leads"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver al listado
      </Link>

      <div className="mt-4">
        {state === "loading" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {state === "notfound" && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No encontramos este lead.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No pudimos cargar el lead.
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

        {state === "ready" && lead && (
          <LeadDetailView
            lead={lead}
            plans={plans}
            onReviewed={(updated) => setLead(updated)}
          />
        )}
      </div>
    </main>
  );
}
