'use client'

import { Pill } from 'lucide-react'
import { useAsync } from '@/lib/use-async'
import { medicationsApi } from '@/lib/api'
import { ProvenanceBadge, VerificationBadge } from '@/components/medlens-badges'
import { ViewSourceButton } from '@/components/provenance-panel'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import type { Medication } from '@/lib/types'

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'warning'> = {
  ACTIVE: 'success',
  DISCONTINUED: 'neutral',
  REPORTED: 'warning',
}

export default function MedicationsPage() {
  const meds = useAsync<Medication[]>(() => medicationsApi.list(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Medications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Medication history with source and verification status.</p>
      </div>

      {meds.error ? (
        <ErrorState message={meds.error} onRetry={meds.reload} />
      ) : meds.loading ? (
        <CardSkeleton rows={4} />
      ) : (meds.data ?? []).length === 0 ? (
        <EmptyState icon={Pill} title="No medications" description="No medications have been recorded." />
      ) : (
        <div className="space-y-3">
          {meds.data!.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Pill className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {m.strength ? `${m.strength} · ` : ''}
                      {m.frequency ?? 'As needed'}
                      {m.startDate ? ` · Started ${m.startDate}` : ''}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge>
                      <ProvenanceBadge source={m.provenance.source} />
                      <VerificationBadge status={m.provenance.verification} />
                    </div>
                  </div>
                </div>
                <ViewSourceButton provenance={m.provenance} label="Source" fieldName={m.name} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground">
        MedLens does not prescribe medication, recommend changes, or adjust dosage. Consult a qualified professional.
      </p>
    </div>
  )
}
