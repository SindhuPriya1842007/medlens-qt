'use client'

import { AlertTriangle } from 'lucide-react'
import { useAsync } from '@/lib/use-async'
import { allergiesApi } from '@/lib/api'
import { ProvenanceBadge, VerificationBadge } from '@/components/medlens-badges'
import { ViewSourceButton } from '@/components/provenance-panel'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import type { Allergy } from '@/lib/types'

const SEVERITY_TONE: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  MILD: 'success',
  MODERATE: 'warning',
  SEVERE: 'danger',
  UNKNOWN: 'neutral',
}

export default function AllergiesPage() {
  const allergies = useAsync<Allergy[]>(() => allergiesApi.list(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Allergies</h1>
        <p className="mt-1 text-sm text-muted-foreground">Structured allergy list with source and verification.</p>
      </div>

      {allergies.error ? (
        <ErrorState message={allergies.error} onRetry={allergies.reload} />
      ) : allergies.loading ? (
        <CardSkeleton rows={3} />
      ) : (allergies.data ?? []).length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No allergies recorded" description="No allergies have been documented." />
      ) : (
        <div className="space-y-3">
          {allergies.data!.map((a) => (
            <Card key={a.id} className="border-danger/20">
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{a.allergen}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.reaction ?? 'Reaction not specified'} · Severity: {a.severity}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge tone={SEVERITY_TONE[a.severity]}>{a.severity}</Badge>
                      <ProvenanceBadge source={a.provenance.source} />
                      <VerificationBadge status={a.provenance.verification} />
                    </div>
                  </div>
                </div>
                <ViewSourceButton provenance={a.provenance} label="Source" fieldName={a.allergen} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
