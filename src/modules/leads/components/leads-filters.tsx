"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Button } from "@/shared/components/ui/button";
import type { SubmissionStatus } from "@/modules/leads/types";

// The URL keeps dates as plain `YYYY-MM-DD`; the DatePicker works in `Date`.
// Noon avoids the day shifting under negative UTC offsets on parse.
function toDate(value: string): Date | undefined {
  return value ? new Date(`${value}T12:00:00`) : undefined;
}

function toParam(date: Date | undefined): string | null {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: "new", label: "Nuevo" },
  { value: "contacted", label: "Contactado" },
  { value: "converted", label: "Convertido" },
  { value: "discarded", label: "Descartado" },
  { value: "spam", label: "Spam" },
];

const ALL = "all";

export function LeadsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? ALL;
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  // Leads are recent by nature: no future dates, a few years of history is plenty.
  const today = new Date();
  const fromMonth = new Date(today.getFullYear() - 3, 0);

  function update(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    params.delete("page"); // any filter change resets to the first page
    router.push(`/dashboard/leads?${params.toString()}`);
  }

  const hasFilters = status !== ALL || Boolean(from) || Boolean(to);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Estado</span>
        <Select
          value={status}
          onValueChange={(value) =>
            update({ status: value === ALL ? null : value })
          }
        >
          <SelectTrigger className="h-9 w-44">
            <SelectValue>
              {(value: string) =>
                value === ALL
                  ? "Todos"
                  : STATUS_OPTIONS.find((option) => option.value === value)
                      ?.label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Desde</span>
        <DatePicker
          value={toDate(from)}
          onChange={(date) => update({ from: toParam(date) })}
          placeholder="Desde"
          className="h-9 w-40"
          startMonth={fromMonth}
          endMonth={today}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Hasta</span>
        <DatePicker
          value={toDate(to)}
          onChange={(date) => update({ to: toParam(date) })}
          placeholder="Hasta"
          className="h-9 w-40"
          startMonth={fromMonth}
          endMonth={today}
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/leads")}
        >
          Limpiar
        </Button>
      )}
    </div>
  );
}
