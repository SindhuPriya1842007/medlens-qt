'use client'

import { ArrowLeft, ChevronDown, ChevronRight, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useAsync } from '@/lib/use-async'
import { labsApi, reportsApi } from '@/lib/api'
import { AiLabel, ConfidenceBadge, StatusBadge, VerificationBadge } from '@/components/medlens-badges'
import { ViewSourceButton } from '@/components/provenance-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import { formatRange } from '@/lib/clinical'
import type { LabResult, MedicalReport } from '@/lib/types'

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>()
  const reportId = params.id
  const report = useAsync<MedicalReport | undefined>(() => reportsApi.get(reportId), [reportId])
  const labs = useAsync<LabResult[]>(() => labsApi.byReport(reportId), [reportId])

  if (report.error) return <ErrorState message={report.error} onRetry={report.reload} />
  if (report.loading) return <CardSkeleton rows={6} />;
  if (!report.data) return <EmptyState icon={FileText} title="Report not found" description="This report may have been removed." />;

  const r = report.data
  const labList = labs.data ?? []
  const categories = [...new Set(labList.map((l) => l.category))]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/reports" className="flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Reports
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{r.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{r.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{r.reportType}</Badge>
            <Badge tone="info">{r.fileType.toUpperCase()}</Badge>
            <VerificationBadge status={r.verificationStatus} />
            <span className="text-xs text-muted-foreground">{r.reportDate} · {r.fileSizeKb} KB</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText data-icon="inline-start" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryStat label="Tests Detected" value={r.testsDetected} />
        <SummaryStat label="Within Range" value={r.withinRange} tone="success" />
        <SummaryStat label="Outside Range" value={r.outsideRange} tone="danger" />
        <SummaryStat label="Needs Verification" value={r.needsVerification} tone="warning" />
      </div>

      <Tabs defaultValue="intelligence">
        <TabsList>
          <TabsTrigger value="intelligence">Report Intelligence</TabsTrigger>
          <TabsTrigger value="structured">Structured Data</TabsTrigger>
          <TabsTrigger value="source">Source View</TabsTrigger>
        </TabsList>

        {/* Tab: Intelligence */}
        <TabsContent value="intelligence" className="space-y-4">
          {/* AI Summary */}
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Brief Report Analysis</CardTitle>
                <AiLabel />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {r.aiSummary.map((s, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold">{s.heading}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
              <p className="border-t border-warning/20 pt-3 text-xs text-muted-foreground">
                This analysis is AI-generated and informational. It does not constitute medical diagnosis or advice.
              </p>
            </CardContent>
          </Card>

          {/* Observations */}
          {r.observations.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Observations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {r.observations.map((obs, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
                    <p className="text-sm">{obs.text}</p>
                    <ViewSourceButton provenance={obs.provenance} label="Source" fieldName="Observation" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {/* Key findings */}
          <Card>
            <CardHeader>
              <CardTitle>Key Findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {labList.filter((l) => l.status === 'LOW' || l.status === 'HIGH').map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{l.testName}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.value} {l.unit} · Ref: {formatRange(l.referenceRange)}
                    </p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
              {labList.filter((l) => l.status === 'LOW' || l.status === 'HIGH').length === 0 ? (
                <p className="text-sm text-muted-foreground">No values outside the provided reference ranges.</p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Structured Data */}
        <TabsContent value="structured" className="space-y-4">
          {labs.error ? (
            <ErrorState message={labs.error} onRetry={labs.reload} />
          ) : labs.loading ? (
            <CardSkeleton rows={6} />
          ) : labList.length === 0 ? (
            <EmptyState icon={FileText} title="No structured data" description="No lab values were extracted from this report." />
          ) : (
            categories.map((cat) => (
              <Card key={cat}>
                <CardHeader>
                  <CardTitle>{cat}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                          <th className="pb-2 pr-4 font-medium">Test</th>
                          <th className="pb-2 pr-4 font-medium">Value</th>
                          <th className="pb-2 pr-4 font-medium">Unit</th>
                          <th className="pb-2 pr-4 font-medium">Reference Range</th>
                          <th className="pb-2 pr-4 font-medium">Status</th>
                          <th className="pb-2 pr-4 font-medium">Confidence</th>
                          <th className="pb-2 font-medium">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labList.filter((l) => l.category === cat).map((l) => (
                          <tr key={l.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 font-medium">{l.testName}</td>
                            <td className="py-3 pr-4">{l.value}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{l.unit}</td>
                            <td className="py-3 pr-4 text-muted-foreground">{formatRange(l.referenceRange)}</td>
                            <td className="py-3 pr-4"><StatusBadge status={l.status} /></td>
                            <td className="py-3 pr-4"><ConfidenceBadge confidence={l.confidence} /></td>
                            <td className="py-3"><ViewSourceButton provenance={l.provenance} label="View" fieldName={l.testName} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab: Source View */}
        <TabsContent value="source" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Original Report File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
                <FileText className="mb-3 size-10 text-muted-foreground" />
                <p className="text-sm font-medium">{r.fileName}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.fileType.toUpperCase()} · {r.fileSizeKb} KB · Uploaded {r.createdAt.slice(0, 10)}</p>
                <Button variant="outline" size="sm" className="mt-4">View Original</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-center text-xs text-muted-foreground">
        MedLens structures report data. It does not provide medical diagnosis or treatment decisions.
      </p>
    </div>
  )
}

function SummaryStat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: number
  tone?: 'neutral' | 'success' | 'danger' | 'warning'
}) {
  const cls =
    tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger' : tone === 'warning' ? 'text-warning-foreground' : 'text-foreground'
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className={`font-display text-2xl font-semibold ${cls}`}>{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
