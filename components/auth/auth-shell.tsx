import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/brand'

const highlights = [
  { icon: Sparkles, text: 'AI assistance that is always clearly labeled' },
  { icon: TrendingUp, text: 'Historical lab values, visualized from structured data' },
  { icon: ShieldCheck, text: 'Secure, traceable, reviewable medical records' },
]

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_20%_10%,rgba(255,255,255,0.18)_0%,transparent_60%)]" />
        <Link href="/" className="relative">
          <span className="inline-flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary-foreground/15">
              <svg viewBox="0 0 24 24" fill="none" className="size-5">
                <path
                  d="M12 3.5c-1.6 2.4-3.8 3.6-6.5 3.9v5.1c0 3.4 2.4 6 6.5 7.9 4.1-1.9 6.5-4.5 6.5-7.9V7.4C15.8 7.1 13.6 5.9 12 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 12.2h2l1-2.2 1.4 4 1-1.8h1.6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">MedLens</span>
          </span>
        </Link>

        <div className="relative">
          <h2 className="max-w-md font-display text-3xl font-semibold leading-tight tracking-tight text-balance">
            Turn complex medical information into a clear, connected record.
          </h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <h.icon className="size-4" />
                </span>
                <span className="text-sm text-primary-foreground/90">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          MedLens does not provide medical diagnosis or treatment decisions.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex lg:hidden">
            <Logo />
          </Link>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
