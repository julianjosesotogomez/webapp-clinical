import { cn } from "@/shared/lib/utils"

interface SpecimenProps {
  label: string
  className?: string
  // When true, render the demo area on a muted surface (useful for light cards).
  contrast?: boolean
  children: React.ReactNode
}

// A labeled cell showing one component in one state.
export function Specimen({
  label,
  className,
  contrast = false,
  children,
}: SpecimenProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border p-4",
          contrast ? "bg-muted" : "bg-background"
        )}
      >
        {children}
      </div>
    </div>
  )
}

// Responsive grid for laying out multiple specimens or swatches.
export function SpecimenGrid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4",
        className
      )}
    >
      {children}
    </div>
  )
}
