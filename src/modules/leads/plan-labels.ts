import type { MedicalPlanCategory } from "@/modules/leads/types";

const CATEGORY_LABELS: Record<MedicalPlanCategory, string> = {
  weight_control: "Control de peso",
  diabetes: "Diabetes",
  hypertension: "Hipertensión",
  cardiovascular: "Cardiovascular",
  nutrition: "Nutrición",
  physical_activity: "Actividad física",
  mental_health: "Salud mental",
  general: "General",
  hormonal_health: "Salud hormonal",
  integral_health: "Salud integral",
};

export function categoryLabel(category: MedicalPlanCategory | null): string {
  return category ? CATEGORY_LABELS[category] : "—";
}
