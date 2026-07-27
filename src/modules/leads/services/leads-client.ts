import { apiFetch } from "@/shared/lib/api-client";
import type {
  LeadDetail,
  LeadFilter,
  LeadSummary,
  MedicalPlan,
  PagedResult,
  ReviewRequest,
} from "@/modules/leads/types";

/** GET /api/v1/leads — paginated, filtered list of leads. */
export function getLeads(
  filter: LeadFilter,
): Promise<PagedResult<LeadSummary>> {
  const params = new URLSearchParams();
  if (filter.status) params.set("status", filter.status);
  if (filter.from) params.set("from", filter.from);
  if (filter.to) params.set("to", filter.to);
  params.set("page", String(filter.page));
  params.set("pageSize", String(filter.pageSize));
  return apiFetch<PagedResult<LeadSummary>>(
    `/api/v1/leads?${params.toString()}`,
  );
}

/** GET /api/v1/leads/{id} — full lead detail. */
export function getLead(id: string): Promise<LeadDetail> {
  return apiFetch<LeadDetail>(`/api/v1/leads/${id}`);
}

/** GET /api/v1/medical-plans — active catalog for the "edit plan" selector. */
export function getMedicalPlans(): Promise<MedicalPlan[]> {
  return apiFetch<MedicalPlan[]>("/api/v1/medical-plans");
}

/**
 * PATCH /api/v1/leads/{id}/review — records the doctor's decision.
 * Throws ApiError on 409 (already reviewed) or 400 (invalid decision).
 */
export function reviewLead(
  id: string,
  request: ReviewRequest,
): Promise<LeadDetail> {
  return apiFetch<LeadDetail>(`/api/v1/leads/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}
