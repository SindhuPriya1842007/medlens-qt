'use client'

import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  FileText,
  GitCompare,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MapPin,
  Menu,
  Pill,
  Salad,
  Search,
  ShieldCheck,
  Stethoscope,
  Timer,
  UserRound,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Logo } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient', label: 'Patient Profile', icon: UserRound },
  { href: '/reports', label: 'Medical Reports', icon: FileText },
  { href: '/labs', label: 'Lab Trends', icon: Activity },
  { href: '/compare', label: 'Report Comparison', icon: GitCompare },
  { href: '/medications', label: 'Medications', icon: Pill },
  { href: '/allergies', label: 'Allergies', icon: AlertTriangle },
  { href: '/exercise', label: 'Exercise', icon: HeartPulse },
  { href: '/nutrition', label: 'Nutrition', icon: Salad },
  { href: '/verification', label: 'Verification', icon: ListChecks },
  { href: '/timeline', label: 'Timeline', icon: Timer },
  { href: '/audit', label: 'Audit History', icon: ShieldCheck },
  { href: '/emergency', label: 'Emergency', icon: MapPin },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>
        <button
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Stethoscope className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name ?? 'Demo User'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? 'demo@medlens.app'}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={logout} aria-label="Sign out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card shadow-xl animate-in slide-in-from-left-4">
            {sidebar}
          </aside>
        </div>
      ) : null}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <button
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="relative hidden max-w-xs flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports, tests…"
              className="h-9 pl-9"
            />
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
            <Link href="/dashboard">
              <Logo className="lg:hidden" showWordmark={false} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
