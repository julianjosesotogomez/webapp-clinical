import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  LeadStatusBadge,
  ReviewStatusBadge,
} from "@/modules/leads/components/lead-status-badge";
import type { LeadSummary } from "@/modules/leads/types";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatConfidence(score: number | null): string {
  return score === null ? "—" : `${Math.round(score * 100)}%`;
}

export function LeadsTable({ leads }: { leads: LeadSummary[] }) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Nombre</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fuente</TableHead>
            <TableHead>Plan sugerido</TableHead>
            <TableHead>Confianza</TableHead>
            <TableHead>Revisión</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="text-foreground hover:text-primary hover:underline"
                >
                  {lead.firstName} {lead.lastName}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {lead.email ?? lead.phone ?? "—"}
              </TableCell>
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {lead.source ?? "—"}
              </TableCell>
              <TableCell>{lead.suggestedPlanName ?? "—"}</TableCell>
              <TableCell>{formatConfidence(lead.confidenceScore)}</TableCell>
              <TableCell>
                <ReviewStatusBadge status={lead.reviewStatus} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {dateFormatter.format(new Date(lead.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
