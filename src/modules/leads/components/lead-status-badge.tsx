import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { ReviewStatus, SubmissionStatus } from "@/modules/leads/types";

const STATUS: Record<SubmissionStatus, { label: string; className: string }> = {
  new: { label: "Nuevo", className: "bg-info/10 text-info" },
  contacted: { label: "Contactado", className: "bg-secondary/15 text-secondary" },
  converted: { label: "Convertido", className: "bg-success/10 text-success" },
  discarded: { label: "Descartado", className: "bg-muted text-muted-foreground" },
  spam: { label: "Spam", className: "bg-destructive/10 text-destructive" },
};

export function LeadStatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, className } = STATUS[status];
  return (
    <Badge variant="outline" className={cn("border-transparent", className)}>
      {label}
    </Badge>
  );
}

const REVIEW: Record<ReviewStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-warning/10 text-warning" },
  approved: { label: "Aprobado", className: "bg-success/10 text-success" },
  rejected: { label: "Rechazado", className: "bg-destructive/10 text-destructive" },
  edited: { label: "Editado", className: "bg-info/10 text-info" },
};

export function ReviewStatusBadge({ status }: { status: ReviewStatus | null }) {
  if (!status) {
    return <span className="text-muted-foreground">—</span>;
  }
  const { label, className } = REVIEW[status];
  return (
    <Badge variant="outline" className={cn("border-transparent", className)}>
      {label}
    </Badge>
  );
}
