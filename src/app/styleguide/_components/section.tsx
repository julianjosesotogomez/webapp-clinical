import { cn } from "@/shared/lib/utils"

interface SectionProps {
  id: string
  title: string
  description?: string
  className?: string
  children: React.ReactNode
}

// Doc-only scaffolding for the styleguide. Not part of the design system —
// lives here, never in src/shared.
export function Section({
  id,
  title,
  description,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-border pt-10", className)}
    >
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  )
}
