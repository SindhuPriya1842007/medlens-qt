import {
  Activity,
  ArrowRight,
  FileSearch,
  FileText,
  GitCompare,
  Lock,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserRound,
  Workflow,
} from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/brand'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { SiteHeader } from '@/components/landing/site-header'
import { AiLabel } from '@/components/medlens-badges'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const problems = [
  'Fragmented medical information across many documents',
  'Difficult-to-read laboratory reports',
  'Missing historical context between visits',
  'Hard-to-track laboratory values over time',
  'Information overload with no clear priorities',
]

const features = [
  { icon: UserRound, title: 'Patient Information', body: 'A structured profile with provenance on every field.' },
  { icon: FileSearch, title: 'Medical Report Processing', body: 'Documents structured into readable, factual records.' },
  { icon: FileText, title: 'Structured Records', body: 'Clean categories instead of one overwhelming table.' },
  { icon: Sparkles, title: 'AI Summary', body: 'Patient-friendly explanations, clearly labeled as AI.' },
  { icon: TrendingUp, title: 'Lab Trends', body: 'Historical values visualized from structured data.' },
  { icon: GitCompare, title: 'Report Comparison', body: 'Factual numerical changes between reports.' },
  { icon: Workflow, title: 'Provenance Tracking', body: 'See exactly where every value came from.' },
  { icon: Lock, title: 'Secure History', body: 'A protected, longitudinal medical record.' },
]

const security = [
  'Secure authentication and protected records',
  'Controlled access to patient information',
  'Secure file handling and validation',
  'No secrets or API keys in the frontend',
]

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,var(--color-accent)_0%,transparent_60%)] opacity-60" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <Badge tone="primary" className="mb-5">
                <Stethoscope className="size-3" />
                AI Clinical Information Intelligence
              </Badge>
              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
                Your Medical Information.{' '}
                <span className="text-primary">Structured. Understandable. Connected.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                MedLens converts medical reports and patient information into structured,
                traceable records with responsible AI assistance — so you always know what a
                report says and where every value came from.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {/* <Button size="lg" render={<Link href="/register" />}>*/}
                <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
                  Get Started
                  <ArrowRight data-icon="inline-end" />
                </Button>
                {/* <Button size="lg" variant="outline" render={<Link href="/login" />}> */}
                <Button
  size="lg"
  variant="outline"
  nativeButton={false}
  render={<Link href="/login" />}
>
  Sign In
</Button>
                {/* <Button size="lg" variant="ghost" render={<Link href="/demo" />}>
                  Explore Demo
                </Button> */}
                <Button
  size="lg"
  variant="ghost"
  nativeButton={false}
  render={<Link href="/demo" />}
>
  Explore Demo
</Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                MedLens organizes and explains medical information. It does not provide medical
                diagnosis or treatment decisions.
              </p>
            </div>
            <div className="lg:pl-6">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Why MedLens?
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Medical information is scattered across history, prescriptions, and lab reports.
              MedLens brings it into one clear, connected view.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((p) => (
                <div
                  key={p}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <Activity className="size-3" />
                  </span>
                  <span className="text-sm text-foreground/90">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              What MedLens does
            </h2>
            <p className="mt-2 text-muted-foreground">
              A secure, structured, traceable and reviewable medical information layer — not just
              an AI chatbot that summarizes a report.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Responsible AI */}
        <section id="responsible-ai" className="border-t border-border bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Responsible AI
                </h2>
                <AiLabel />
              </div>
              <p className="text-lg leading-relaxed text-foreground/90 text-pretty">
                MedLens helps organize and explain medical information. It does not provide
                medical diagnosis or treatment decisions.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                AI is used only for extraction, structuring, brief explanation and categorization.
                Reference-range comparison, calculations and charts are handled by deterministic
                code — and every AI output is clearly labeled and traceable to its source.
              </p>
            </div>
            <div className="grid gap-3 self-center">
              {[
                'Never diagnoses or prescribes',
                'Never invents reference ranges or values',
                'Always labels AI-generated content',
                'Always keeps a human in the loop for verification',
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <ShieldCheck className="size-5 shrink-0 text-success" />
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Security by design
              </h2>
              <p className="mt-2 text-muted-foreground">
                MedLens is built assuming a secure backend with JWT authentication, hashed
                passwords, protected routes and validated file uploads.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {security.map((s) => (
                <div
                  key={s}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground/90">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-primary/5 px-6 py-14 text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-balance">
                Bring your medical information into one clear view.
              </h2>
              <p className="max-w-xl text-muted-foreground text-pretty">
                Turn complex medical information into a clear, connected record.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* <Button size="lg" render={<Link href="/register" />}>
                  Get Started
                  <ArrowRight data-icon="inline-end" />
                </Button> */}
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/register" />}
                >
                  Get Started
                  <ArrowRight data-icon="inline-end" />
                </Button>
               
              </div>
            </div>
          </div>
        </section>
      </main>

    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-center text-xs leading-relaxed text-muted-foreground sm:text-left">
            MedLens is a demonstration product. It does not provide medical diagnosis
            or treatment decisions.
          </p>
        </div>
      </div>
    </footer>
        </div>
  )
}