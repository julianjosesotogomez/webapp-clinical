import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LeadStatusBadge } from "@/modules/leads/components/lead-status-badge";
import { QuestionnaireAnswers } from "@/modules/leads/components/questionnaire-answers";
import { AgentResultCard } from "@/modules/leads/components/agent-result-card";
import { ReviewPanel } from "@/modules/leads/components/review-panel";
import type { Gender, LeadDetail, MedicalPlan } from "@/modules/leads/types";

const GENDER_LABELS: Record<Gender, string> = {
  male: "Masculino",
  female: "Femenino",
  other: "Otro",
  not_specified: "No especificado",
};

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

export function LeadDetailView({
  lead,
  plans,
  onReviewed,
}: {
  lead: LeadDetail;
  plans: MedicalPlan[];
  onReviewed: (updated: LeadDetail) => void;
}) {
  const latest = lead.agentResults[0] ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-lg">
                {lead.firstName} {lead.lastName}
              </CardTitle>
              <LeadStatusBadge status={lead.status} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Detail label="Correo" value={lead.email} />
              <Detail label="Teléfono" value={lead.phone} />
              <Detail label="Documento" value={lead.idNumber} />
              <Detail label="Género" value={GENDER_LABELS[lead.gender]} />
              <Detail label="Fecha de nacimiento" value={lead.birthDate} />
              <Detail label="Ciudad" value={lead.city} />
              <Detail label="Fuente" value={lead.source} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cuestionario</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionnaireAnswers responses={lead.questionnaireResponses} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sugerencia del agente</CardTitle>
          </CardHeader>
          <CardContent>
            {latest ? (
              <AgentResultCard result={latest} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Este lead aún no tiene una sugerencia del agente.
              </p>
            )}
          </CardContent>
        </Card>

        {latest && (
          <Card>
            <CardHeader>
              <CardTitle>Decisión del médico</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewPanel
                leadId={lead.id}
                result={latest}
                plans={plans}
                onReviewed={onReviewed}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
