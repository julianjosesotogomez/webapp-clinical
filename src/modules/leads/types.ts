export type SubmissionStatus =
  | "new"
  | "contacted"
  | "converted"
  | "discarded"
  | "spam";

export type ReviewStatus = "pending" | "approved" | "rejected" | "edited";

/** Mirrors the .NET LeadSummaryDto (camelCase over the wire, enums as snake_case strings). */
export interface LeadSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  status: SubmissionStatus;
  source: string | null;
  createdAt: string;
  suggestedPlanName: string | null;
  confidenceScore: number | null;
  reviewStatus: ReviewStatus | null;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LeadFilter {
  status?: SubmissionStatus;
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
}

export type Gender = "male" | "female" | "other" | "not_specified";

export type MedicalPlanCategory =
  | "weight_control"
  | "diabetes"
  | "hypertension"
  | "cardiovascular"
  | "nutrition"
  | "physical_activity"
  | "mental_health"
  | "general"
  | "hormonal_health"
  | "integral_health";

export interface MedicalPlan {
  id: string;
  name: string;
  category: MedicalPlanCategory;
  durationWeeks: number | null;
  description: string | null;
}

export interface AlternativePlan {
  planId: string;
  planName: string | null;
  category: MedicalPlanCategory | null;
  score: number;
}

export interface AgentResultDetail {
  id: string;
  suggestedPlanName: string | null;
  suggestedPlanCategory: MedicalPlanCategory | null;
  confidenceScore: number | null;
  modelVersion: string;
  agentNotes: string | null;
  inputData: Record<string, unknown>;
  alternatives: AlternativePlan[];
  reviewStatus: ReviewStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  doctorNotes: string | null;
  finalPlanId: string | null;
  finalPlanName: string | null;
  createdAt: string;
}

export interface QuestionnaireResponseDetail {
  id: string;
  questionnaireVersion: string;
  answers: Record<string, unknown>;
  completedAt: string;
}

export interface LeadDetail {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  gender: Gender;
  idNumber: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  status: SubmissionStatus;
  source: string | null;
  createdAt: string;
  questionnaireResponses: QuestionnaireResponseDetail[];
  agentResults: AgentResultDetail[];
}

export type ReviewDecision = "approved" | "rejected" | "edited";

export interface ReviewRequest {
  decision: ReviewDecision;
  finalPlanId?: string;
  doctorNotes?: string;
}
