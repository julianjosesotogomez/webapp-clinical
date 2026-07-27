import { Badge } from "@/shared/components/ui/badge";
import { categoryLabel } from "@/modules/leads/plan-labels";
import type { AgentResultDetail } from "@/modules/leads/types";

function toPercent(score: number | null): number | null {
  return score === null ? null : Math.round(score * 100);
}

export function AgentResultCard({ result }: { result: AgentResultDetail }) {
  const confidence = toPercent(result.confidenceScore);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground">
          Plan sugerido por el agente
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {result.suggestedPlanName ?? "Sin plan sugerido"}
          </span>
          {result.suggestedPlanCategory && (
            <Badge variant="secondary">
              {categoryLabel(result.suggestedPlanCategory)}
            </Badge>
          )}
        </div>
      </div>

      {confidence !== null && (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Confianza</span>
            <span>{confidence}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      )}

      {result.agentNotes && (
        <div>
          <p className="text-xs text-muted-foreground">Notas del agente</p>
          <p className="mt-1 text-sm whitespace-pre-line text-foreground">
            {result.agentNotes}
          </p>
        </div>
      )}

      {result.alternatives.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Alternativas</p>
          <ul className="space-y-1.5">
            {result.alternatives.map((alt) => (
              <li
                key={alt.planId}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-foreground">
                  {alt.planName ?? "Plan"}{" "}
                  <span className="text-muted-foreground">
                    · {categoryLabel(alt.category)}
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {Math.round(alt.score * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
