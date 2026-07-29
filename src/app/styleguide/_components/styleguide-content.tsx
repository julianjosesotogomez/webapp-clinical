"use client"

import { useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { HeroMedia } from "@/shared/components/hero-media"
import { SiteFooter } from "@/shared/components/site-footer"
import {
  LeadStatusBadge,
  ReviewStatusBadge,
} from "@/modules/leads/components/lead-status-badge"
import { AgentResultCard } from "@/modules/leads/components/agent-result-card"
import { QuestionnaireAnswers } from "@/modules/leads/components/questionnaire-answers"
import { ReviewPanel } from "@/modules/leads/components/review-panel"
import type {
  AgentResultDetail,
  QuestionnaireResponseDetail,
  SubmissionStatus,
} from "@/modules/leads/types"

import { Section } from "./section"
import { Swatch } from "./swatch"
import { Specimen, SpecimenGrid } from "./specimen"

// ---- Nav model ----

const sections = [
  { id: "colors", label: "Colores" },
  { id: "typography", label: "Tipografía" },
  { id: "radius", label: "Radios y sombras" },
  { id: "buttons", label: "Botones" },
  { id: "badges", label: "Badges y estados" },
  { id: "form", label: "Campos de formulario" },
  { id: "table", label: "Tabla y skeleton" },
  { id: "lead-cards", label: "Tarjetas del lead" },
  { id: "review", label: "Decisión del médico" },
  { id: "hero", label: "Panel de marca (login)" },
  { id: "footer", label: "Footer" },
]

// ---- Token tables (values mirrored from globals.css) ----

const semanticColors = [
  { label: "Primary", token: "--primary", value: "#162a43 · navy", swatch: "bg-primary text-primary-foreground" },
  { label: "Secondary", token: "--secondary", value: "#537892 · steel", swatch: "bg-secondary text-secondary-foreground" },
  { label: "Accent", token: "--accent", value: "oklch(0.90 0.04 245)", swatch: "bg-accent text-accent-foreground" },
  { label: "Destructive", token: "--destructive", value: "oklch(0.53 0.19 25)", swatch: "bg-destructive text-white" },
  { label: "Success", token: "--success", value: "oklch(0.56 0.12 162)", swatch: "bg-success text-success-foreground" },
  { label: "Warning", token: "--warning", value: "oklch(0.60 0.13 72)", swatch: "bg-warning text-warning-foreground" },
  { label: "Info", token: "--info", value: "oklch(0.56 0.10 250)", swatch: "bg-info text-info-foreground" },
]

const surfaceColors = [
  { label: "Background", token: "--background", value: "blanco frío", swatch: "bg-background text-foreground" },
  { label: "Card", token: "--card", value: "oklch(1 0 0)", swatch: "bg-card text-card-foreground" },
  { label: "Muted", token: "--muted", value: "oklch(0.94 0.01 235)", swatch: "bg-muted text-muted-foreground" },
  { label: "Border", token: "--border", value: "oklch(0.90 0.012 235)", swatch: "bg-border text-foreground" },
  { label: "Foreground", token: "--foreground", value: "#101d2e · tinta", swatch: "bg-foreground text-background" },
]

const buttonVariantNames = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const buttonSizes = ["xs", "sm", "default", "lg"] as const
const badgeVariantNames = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const
const leadStatuses: SubmissionStatus[] = ["new", "contacted", "converted", "discarded", "spam"]

const radii = [
  { label: "sm", cls: "rounded-sm" },
  { label: "md", cls: "rounded-md" },
  { label: "lg", cls: "rounded-lg" },
  { label: "xl", cls: "rounded-xl" },
  { label: "2xl", cls: "rounded-2xl" },
]

// ---- Sample data for the domain components ----

const sampleAgentResult: AgentResultDetail = {
  id: "sg-agent",
  suggestedPlanName: "Programa Pérdida de Peso",
  suggestedPlanCategory: "weight_control",
  confidenceScore: 0.82,
  modelVersion: "rules-v2.0",
  agentNotes:
    "weight_control: IMC 27 (sobrepeso) (+0.18); deseo de bajar de peso (+0.15). Margen sobre segunda línea: 0.240.",
  inputData: {},
  alternatives: [
    { planId: "p2", planName: "Programa Salud Integral", category: "integral_health", score: 0.34 },
    { planId: "p3", planName: "Valoración Integral", category: "general", score: 0.18 },
  ],
  reviewStatus: "pending",
  reviewedBy: null,
  reviewedAt: null,
  doctorNotes: null,
  finalPlanId: null,
  finalPlanName: null,
  createdAt: "2026-07-20T10:00:00Z",
}

const reviewedAgentResult: AgentResultDetail = {
  ...sampleAgentResult,
  reviewStatus: "approved",
  reviewedAt: "2026-07-21T14:30:00Z",
  finalPlanName: "Programa Pérdida de Peso",
  doctorNotes: "Coincide con la valoración. Se cita para primera consulta.",
}

const sampleResponses: QuestionnaireResponseDetail[] = [
  {
    id: "sg-q",
    questionnaireVersion: "v2.0",
    answers: {
      age_confirm: "si",
      age: 34,
      weight_kg: 78,
      height_cm: 172,
      main_goal: "bajar_de_peso",
      metabolic_dx: ["prediabetes"],
    },
    completedAt: "2026-07-20T09:58:00Z",
  },
]

export function StyleguideContent() {
  const [dark, setDark] = useState(false)
  const [selectValue, setSelectValue] = useState("new")
  const [pickedDate, setPickedDate] = useState<Date | undefined>()

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Styleguide · Panel clínico
          </h1>
          <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">
            Catálogo vivo del sistema de diseño de la consola del médico. Los mismos
            componentes y tokens del producto — no capturas. Cambia un token en{" "}
            <code className="font-mono text-xs">globals.css</code> y se refleja aquí.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {dark ? <SunIcon /> : <MoonIcon />}
          {dark ? "Claro" : "Oscuro"}
        </Button>
      </div>

      {/* Horizontal nav */}
      <nav className="sticky top-0 z-10 -mx-6 mb-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-border bg-background/90 px-6 py-3 text-sm backdrop-blur">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-4">
        {/* Colors */}
        <Section
          id="colors"
          title="Colores"
          description="Paleta de marca navy/steel/sky y superficies. Valores espejo de globals.css."
        >
          <div className="space-y-6">
            <SpecimenGrid>
              {semanticColors.map((c) => (
                <Swatch key={c.token} label={c.label} token={c.token} value={c.value} swatchClassName={c.swatch} />
              ))}
            </SpecimenGrid>
            <SpecimenGrid>
              {surfaceColors.map((c) => (
                <Swatch key={c.token} label={c.label} token={c.token} value={c.value} swatchClassName={c.swatch} />
              ))}
            </SpecimenGrid>
          </div>
        </Section>

        {/* Typography */}
        <Section
          id="typography"
          title="Tipografía"
          description="Jost para la interfaz; Geist Mono para datos clínicos (IDs, valores, fechas)."
        >
          <div className="space-y-3">
            <p className="text-3xl font-semibold tracking-tight">Título · text-3xl</p>
            <p className="text-xl font-semibold">Subtítulo · text-xl</p>
            <p className="text-base">Cuerpo · text-base — la base de la lectura.</p>
            <p className="text-sm text-muted-foreground">Secundario · text-sm muted</p>
            <p className="font-mono text-sm">Mono · a1b2c3 · 82% · 2026-07-20</p>
          </div>
        </Section>

        {/* Radius & shadows */}
        <Section id="radius" title="Radios y sombras" description="Escala de radios sobre --radius y elevación con ring.">
          <SpecimenGrid>
            {radii.map((r) => (
              <Specimen key={r.label} label={r.label}>
                <div className={`size-16 bg-primary ${r.cls}`} />
              </Specimen>
            ))}
            <Specimen label="ring-1">
              <div className="size-16 rounded-xl bg-card ring-1 ring-foreground/10" />
            </Specimen>
            <Specimen label="shadow-sm">
              <div className="size-16 rounded-xl bg-card shadow-sm" />
            </Specimen>
          </SpecimenGrid>
        </Section>

        {/* Buttons */}
        <Section id="buttons" title="Botones" description="Variantes y tamaños.">
          <div className="space-y-4">
            <Specimen label="variantes">
              {buttonVariantNames.map((v) => (
                <Button key={v} variant={v}>
                  {v}
                </Button>
              ))}
            </Specimen>
            <Specimen label="tamaños">
              {buttonSizes.map((s) => (
                <Button key={s} size={s}>
                  {s}
                </Button>
              ))}
            </Specimen>
            <Specimen label="disabled">
              <Button disabled>Deshabilitado</Button>
              <Button variant="outline" disabled>
                Deshabilitado
              </Button>
            </Specimen>
          </div>
        </Section>

        {/* Badges & statuses */}
        <Section
          id="badges"
          title="Badges y estados"
          description="Badge genérico + los badges de estado y revisión de un lead."
        >
          <div className="space-y-4">
            <Specimen label="badge · variantes">
              {badgeVariantNames.map((v) => (
                <Badge key={v} variant={v}>
                  {v}
                </Badge>
              ))}
            </Specimen>
            <Specimen label="estado del lead">
              {leadStatuses.map((s) => (
                <LeadStatusBadge key={s} status={s} />
              ))}
            </Specimen>
            <Specimen label="estado de revisión">
              {(["pending", "approved", "rejected", "edited"] as const).map((s) => (
                <ReviewStatusBadge key={s} status={s} />
              ))}
            </Specimen>
          </div>
        </Section>

        {/* Form fields */}
        <Section id="form" title="Campos de formulario" description="Controles con react-hook-form + zod, incluido el date-picker de marca.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel>Correo</FieldLabel>
              <Input type="email" placeholder="doctor@clinica.com" />
            </Field>
            <Field data-invalid>
              <FieldLabel>Con error</FieldLabel>
              <Input aria-invalid defaultValue="valor inválido" />
              <FieldError>Este campo es obligatorio.</FieldError>
            </Field>
            <Field>
              <FieldLabel>Estado</FieldLabel>
              <Select value={selectValue} onValueChange={(v) => setSelectValue(v ?? "new")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leadStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Fecha</FieldLabel>
              <DatePicker value={pickedDate} onChange={setPickedDate} placeholder="Selecciona una fecha" />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel>Notas</FieldLabel>
              <Textarea placeholder="Justificación de la decisión…" />
            </Field>
          </div>
        </Section>

        {/* Table & skeleton */}
        <Section id="table" title="Tabla y skeleton" description="La tabla del listado de leads y su estado de carga.">
          <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Plan sugerido</TableHead>
                  <TableHead>Revisión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Ana Gómez</TableCell>
                  <TableCell>
                    <LeadStatusBadge status="new" />
                  </TableCell>
                  <TableCell>Programa Pérdida de Peso</TableCell>
                  <TableCell>
                    <ReviewStatusBadge status="pending" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Section>

        {/* Lead cards */}
        <Section
          id="lead-cards"
          title="Tarjetas del lead"
          description="Sugerencia del agente (con barra de confianza) y respuestas legibles del cuestionario."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sugerencia del agente</CardTitle>
              </CardHeader>
              <CardContent>
                <AgentResultCard result={sampleAgentResult} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cuestionario</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionnaireAnswers responses={sampleResponses} />
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Review panel (read-only decision) */}
        <Section
          id="review"
          title="Decisión del médico"
          description="Panel de revisión en su estado ya resuelto (solo lectura). Las acciones aprobar/editar/rechazar viven en el detalle del lead."
        >
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Decisión del médico</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewPanel
                leadId="sg-lead"
                result={reviewedAgentResult}
                plans={[]}
                onReviewed={() => {}}
              />
            </CardContent>
          </Card>
        </Section>

        {/* Hero / login brand panel */}
        <Section
          id="hero"
          title="Panel de marca (login)"
          description="El video de marca con scrim navy que acompaña al formulario de login desde tablet."
        >
          <div className="relative isolate flex h-64 items-end overflow-hidden rounded-xl">
            <HeroMedia media={{ src: "/media/hero.mp4", alt: "Entorno clínico profesional" }} />
            <div className="relative z-10 p-6 [text-shadow:0_1px_10px_rgb(0_0_0_/_0.35)]">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">MediCoreAI</p>
              <p className="mt-1 text-xl font-semibold text-primary-foreground">Panel clínico</p>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <Section id="footer" title="Footer" description="Footer global montado en el layout raíz.">
          <div className="rounded-xl border border-border">
            <SiteFooter />
          </div>
        </Section>
      </div>
    </div>
  )
}
