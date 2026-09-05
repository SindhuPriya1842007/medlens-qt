'use client'

import { ListChecks, ShieldCheck } from 'lucide-react'
import { useAsync } from '@/lib/use-async'
import { labsApi } from '@/lib/api'
import { StatusBadge, ConfidenceBadge, VerificationBadge } from '@/components/medlens-badges'
import { ViewSourceButton } from '@/components/provenance-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import { formatRange } from '@/lib/clinical'
import type { LabResult } from '@/lib/types'

export default function VerificationPage() {
  const labs = useAsync<LabResult[]>(() => labsApi.list(), [])

  const needsReview = (labs.data ?? []).filter(
    (l) => l.status === 'NEEDS_REVIEW' || l.confidence !== 'HIGH' || l.provenance.verification !== 'VERIFIED',
  )
  const verified = (labs.data ?? []).filter(
    (l) => l.provenance.verification === 'VERIFIED' && l.confidence === 'HIGH',
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Verification Center</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review extracted information and mark it as verified.</p>
      </div>

      {labs.error ? (
        <ErrorState message={labs.error} onRetry={labs.reload} />
      ) : labs.loading ? (
        <CardSkeleton rows={5} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-warning/15 text-warning-foreground">
                  <ListChecks className="size-4" />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold">{needsReview.length}</p>
                  <p className="text-xs text-muted-foreground">Items needing review</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-success/30 bg-success/5">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-success/15 text-success">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold">{verified.length}</p>
                  <p className="text-xs text-muted-foreground">Verified items</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold">Needs Review</h2>
            {needsReview.length === 0 ? (
              <EmptyState icon={ShieldCheck} title="All verified" description="No items require review." />
            ) : (
              <div className="space-y-3">
                {needsReview.map((l) => (
                  <Card key={l.id}>
                    <CardContent className="flex items-start justify-between gap-4 p-4">
                      <div>
                        <p className="font-medium">{l.testName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {l.value} {l.unit} · Ref: {formatRange(l.referenceRange)} · {l.reportName} ({l.date})
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <StatusBadge status={l.status} />
                          <ConfidenceBadge confidence={l.confidence} />
                          <VerificationBadge status={l.provenance.verification} />
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <ViewSourceButton provenance={l.provenance} label="Source" fieldName={l.testName} />
                        <div className="flex gap-2">
                          <Button variant="outline" size="xs">Edit</Button>
                          <Button size="xs">Verify</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Human verification ensures AI-extracted data is accurate. MedLens does not provide medical diagnosis.
      </p>
    </div>
  )
}
