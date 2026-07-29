import { cn } from "@/shared/lib/utils"

interface SwatchProps {
  label: string
  token: string
  value?: string
  // Full Tailwind classes for the block: background (+ optional text / ring).
  swatchClassName: string
  sample?: string
}

// A single color-token chip: colored block + token name + raw value.
export function Swatch({
  label,
  token,
  value,
  swatchClassName,
  sample = "Aa",
}: SwatchProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "flex h-16 items-center justify-center rounded-lg text-sm font-medium ring-1 ring-inset ring-foreground/10",
          swatchClassName
        )}
      >
        {sample}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium">{label}</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {token}
        </span>
        {value && (
          <span className="font-mono text-[11px] text-muted-foreground">
            {value}
          </span>
        )}
      </div>
    </div>
  )
}
