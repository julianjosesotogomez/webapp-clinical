import { formatAnswers } from "@/modules/leads/questionnaire-labels";
import type { QuestionnaireResponseDetail } from "@/modules/leads/types";

export function QuestionnaireAnswers({
  responses,
}: {
  responses: QuestionnaireResponseDetail[];
}) {
  if (responses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este lead no tiene respuestas de cuestionario.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {responses.map((response) => {
        const answers = formatAnswers(response.answers);
        return (
          <div key={response.id}>
            <p className="mb-3 text-xs text-muted-foreground">
              Cuestionario {response.questionnaireVersion}
            </p>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {answers.map((answer, index) => (
                <div key={index} className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">
                    {answer.label}
                  </dt>
                  <dd className="text-sm text-foreground">
                    {answer.value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
