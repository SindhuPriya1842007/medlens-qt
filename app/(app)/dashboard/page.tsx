'use client'

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  FileText,
  Pill,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import Link from 'next/link'
import { useAsync } from '@/lib/use-async'
import { dashboardApi, reportsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ErrorState, GridSkeleton, CardSkeleton } from '@/components/states'
import { VerificationBadge } from '@/components/medlens-badges'
import type { DashboardStats, MedicalReport } from '@/lib/types'

export default function DashboardPage() {
  const stats = useAsync<DashboardStats>(() => dashboardApi.stats(), [])
  const reports = useAsync<MedicalReport[]>(() => reportsApi.list(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your structured medical information.
        </p>
      </div>

      {/* Stats grid */}
      {stats.error ? (
        <ErrorState message={stats.error} onRetry={stats.reload} />
      ) : stats.loading ? (
        <GridSkeleton count={5} />
      ) : stats.data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={FileText} label="Total Reports" value={stats.data.totalReports} tone="primary" />
          <StatCard icon={TriangleAlert} label="Abnormal Values" value={stats.data.abnormalValues} tone="danger" />
          <StatCard icon={ShieldCheck} label="Pending Verification" value={stats.data.pendingVerification} tone="warning" />
          <StatCard icon={Pill} label="Active Medications" value={stats.data.activeMedications} tone="info" />
          <StatCard icon={AlertTriangle} label="Allergies" value={stats.data.allergies} tone="danger" />
        </div>
      ) : null}

      {/* Important alerts */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
            <TriangleAlert className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-foreground">Items needing your attention</p>
            <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
              {stats.data?.pendingVerification ? (
                <li>• {stats.data.pendingVerification} lab values need verification</li>
              ) : null}
              {stats.data?.abnormalValues ? (
                <li>• {stats.data.abnormalValues} values are outside the provided reference ranges</li>
              ) : null}
            </ul>
            {/* <Button variant="outline" size="sm" className="mt-3" render={<Link href="/verification" />}>
              Review now
              <ArrowRight data-icon="inline-end" /> */}

            {/* </Button> */}
            <Button
  variant="outline"
  size="sm"
  className="mt-3"
  nativeButton={false}
  render={<Link href="/verification" />}
>
  Review now
  <ArrowRight data-icon="inline-end" />
</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent reports + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent reports */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent Reports</h2>
            {/* <Button variant="ghost" size="sm" render={<Link href="/reports" />}>
              View all
              <ArrowRight data-icon="inline-end" />
            </Button> */}
            <Button
  variant="outline"
  size="sm"
  className="mt-3"
  nativeButton={false}
  render={<Link href="/verification" />}
>
  Review now
  <ArrowRight data-icon="inline-end" />
</Button>
          </div>
          {reports.error ? (
            <ErrorState message={reports.error} onRetry={reports.reload} />
          ) : reports.loading ? (
            <CardSkeleton rows={4} />
          ) : reports.data ? (
            <div className="space-y-3">
              {reports.data.slice(0, 4).map((r) => (
                <Link key={r.id} href={`/reports/${r.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{r.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.reportDate} · {r.testsDetected} tests · {r.outsideRange} outside range
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <VerificationBadge status={r.verificationStatus} />
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction icon={FileText} label="View Reports" href="/reports" />
            <QuickAction icon={Activity} label="Lab Trends" href="/labs" />
            <QuickAction icon={Pill} label="Medications" href="/medications" />
            <QuickAction icon={ShieldCheck} label="Verification" href="/verification" />
            <QuickAction icon={TriangleAlert} label="Emergency" href="/emergency" />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground">
        MedLens organizes and explains medical information. It does not provide medical diagnosis or treatment decisions.
      </p>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof FileText
  label: string
  value: number
  tone: 'primary' | 'danger' | 'warning' | 'info'
}) {
  const colors = {
    primary: 'text-primary bg-primary/10',
    danger: 'text-danger bg-danger/10',
    warning: 'text-warning-foreground bg-warning/10',
    info: 'text-info bg-info/10',
  }
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${colors[tone]}`}>
          <Icon className="size-4" />
        </div>
        <p className="font-display text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof FileText
  label: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-3.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
          <span className="text-sm font-medium">{label}</span>
          <ArrowRight className="ml-auto size-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}
