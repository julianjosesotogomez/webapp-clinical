"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { SubmissionStatus } from "@/modules/leads/types";

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
        <label htmlFor="from" className="text-xs font-medium text-muted-foreground">
          Desde
        </label>
        <Input
          id="from"
          type="date"
          value={from}
          className="h-9 w-40"
          onChange={(event) => update({ from: event.target.value || null })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="to" className="text-xs font-medium text-muted-foreground">
          Hasta
        </label>
        <Input
          id="to"
          type="date"
          value={to}
          className="h-9 w-40"
          onChange={(event) => update({ to: event.target.value || null })}
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
