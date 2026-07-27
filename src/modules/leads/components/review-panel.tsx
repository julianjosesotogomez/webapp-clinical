"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ApiError } from "@/shared/lib/api-client";
import { reviewLead } from "@/modules/leads/services/leads-client";
import { categoryLabel } from "@/modules/leads/plan-labels";
import { ReviewStatusBadge } from "@/modules/leads/components/lead-status-badge";
import type {
  AgentResultDetail,
  LeadDetail,
  MedicalPlan,
  ReviewDecision,
} from "@/modules/leads/types";

type Mode = "idle" | "reject" | "edit";

function DecisionSummary({ result }: { result: AgentResultDetail }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Decisión:</span>
        <ReviewStatusBadge status={result.reviewStatus} />
      </div>
      {result.finalPlanName && (
        <p className="text-sm">
          <span className="text-muted-foreground">Plan final: </span>
          {result.finalPlanName}
        </p>
      )}
      {result.doctorNotes && (
        <div>
          <p className="text-xs text-muted-foreground">Notas del médico</p>
          <p className="mt-1 text-sm whitespace-pre-line text-foreground">
            {result.doctorNotes}
          </p>
        </div>
      )}
      {result.reviewedAt && (
        <p className="text-xs text-muted-foreground">
          Revisado el {new Date(result.reviewedAt).toLocaleString("es-CO")}
        </p>
      )}
    </div>
  );
}

export function ReviewPanel({
  leadId,
  result,
  plans,
  onReviewed,
}: {
  leadId: string;
  result: AgentResultDetail;
  plans: MedicalPlan[];
  onReviewed: (updated: LeadDetail) => void;
}) {
  const [mode, setMode] = useState<Mode>("idle");
  const [notes, setNotes] = useState("");
  const [finalPlanId, setFinalPlanId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (result.reviewStatus !== "pending") {
    return <DecisionSummary result={result} />;
  }

  async function submit(decision: ReviewDecision) {
    setError(null);
    if (decision === "rejected" && notes.trim().length === 0) {
      setError("Escribe una justificación para rechazar.");
      return;
    }
    if (decision === "edited" && !finalPlanId) {
      setError("Selecciona el plan final.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await reviewLead(leadId, {
        decision,
        finalPlanId: decision === "edited" ? finalPlanId : undefined,
        doctorNotes: notes.trim() || undefined,
      });
      onReviewed(updated);
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 409
          ? "Este lead ya fue revisado por otro médico."
          : "No pudimos guardar la decisión. Intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {mode === "idle" && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" disabled={submitting} onClick={() => submit("approved")}>
            Aprobar
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={submitting}
            onClick={() => {
              setError(null);
              setMode("edit");
            }}
          >
            Editar plan
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={submitting}
            onClick={() => {
              setError(null);
              setMode("reject");
            }}
          >
            Rechazar
          </Button>
        </div>
      )}

      {mode === "edit" && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Plan final
            </span>
            <Select
              value={finalPlanId}
              onValueChange={(value) => setFinalPlanId(value ?? "")}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue>
                  {(value: string) =>
                    plans.find((plan) => plan.id === value)?.name ??
                    "Selecciona un plan"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} · {categoryLabel(plan.category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            placeholder="Notas (opcional)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" disabled={submitting} onClick={() => submit("edited")}>
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={submitting}
              onClick={() => setMode("idle")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {mode === "reject" && (
        <div className="space-y-3">
          <Textarea
            placeholder="Justificación del rechazo (obligatoria)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              disabled={submitting}
              onClick={() => submit("rejected")}
            >
              Confirmar rechazo
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={submitting}
              onClick={() => setMode("idle")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
