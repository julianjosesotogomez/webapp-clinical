import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { HeroMedia } from "@/shared/components/hero-media";
import { LoginForm } from "@/modules/auth/components/login-form";

const loginMedia = {
  src: "/media/hero.mp4",
  alt: "Entorno clínico profesional",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1">
      {/* Brand panel — hidden on phones, shown from tablet up. Flex children
          stretch to the row's full height, so the video fills its half. */}
      <section className="relative isolate hidden w-1/2 flex-col justify-between overflow-hidden p-10 md:flex lg:p-12">
        <HeroMedia media={loginMedia} />
        <div className="relative z-10 [text-shadow:0_1px_10px_rgb(0_0_0_/_0.35)]">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/75">
            MediCoreAI
          </p>
        </div>
        <div className="relative z-10 max-w-md [text-shadow:0_1px_10px_rgb(0_0_0_/_0.35)]">
          <h1 className="text-3xl font-semibold tracking-tight text-primary-foreground">
            Panel clínico
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Revisa los leads capturados, valida la sugerencia del agente y decide
            el plan de cada paciente en un solo lugar.
          </p>
        </div>
      </section>

      {/* Login form — always visible, centered in its half (full width on phones). */}
      <section className="flex w-full items-center justify-center bg-background p-6 md:w-1/2">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:hidden">
              MediCoreAI
            </p>
            <CardTitle className="text-xl">Ingresa a tu cuenta</CardTitle>
            <CardDescription>Acceso exclusivo para personal médico.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
