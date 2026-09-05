'use client'

import { FileText, Search, Upload } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useAsync } from '@/lib/use-async'
import { reportsApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ErrorState, GridSkeleton, EmptyState } from '@/components/states'
import { VerificationBadge } from '@/components/medlens-badges'
import type { MedicalReport } from '@/lib/types'

export default function ReportsPage() {
  const reports = useAsync<MedicalReport[]>(() => reportsApi.list(), [])
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!reports.data) return []
    const q = query.toLowerCase()
    return reports.data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.reportType.toLowerCase().includes(q),
    )
  }, [reports.data, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Medical Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your uploaded medical reports and their structured analysis.
          </p>
        </div>
        <Button>
          <Upload data-icon="inline-start" />
          Upload Report
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search reports…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {reports.error ? (
        <ErrorState message={reports.error} onRetry={reports.reload} />
      ) : reports.loading ? (
        <GridSkeleton count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description={query ? 'Try a different search term.' : 'Upload your first medical report to get started.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => (
            <Link key={r.id} href={`/reports/${r.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.reportDate}</p>
                      </div>
                    </div>
                    <VerificationBadge status={r.verificationStatus} />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <MiniStat label="Tests" value={r.testsDetected} />
                    <MiniStat label="Outside" value={r.outsideRange} tone="danger" />
                    <MiniStat label="Review" value={r.needsVerification} tone="warning" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge tone="neutral">{r.reportType}</Badge>
                    <Badge tone="info">{r.fileType.toUpperCase()}</Badge>
                    <span className="ml-auto text-xs text-muted-foreground">{r.fileSizeKb} KB</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        MedLens structures report data. It does not provide medical diagnosis or treatment decisions.
      </p>
    </div>
  )
}

function MiniStat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: number
  tone?: 'neutral' | 'danger' | 'warning'
}) {
  const cls =
    tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning-foreground' : 'text-foreground'
  return (
    <div className="rounded-lg border border-border bg-muted/40 py-2">
      <p className={`font-display text-lg font-semibold ${cls}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
