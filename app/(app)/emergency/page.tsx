'use client'

import { MapPin, Phone } from 'lucide-react'
import { useAsync } from '@/lib/use-async'
import { emergencyApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import type { Hospital } from '@/lib/types'

export default function EmergencyPage() {
  const hospitals = useAsync<Hospital[]>(() => emergencyApi.nearby(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Emergency Information</h1>
        <p className="mt-1 text-sm text-muted-foreground">Nearby hospitals and emergency facilities.</p>
      </div>

      <Card className="border-danger/30 bg-danger/5">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-danger">If you are experiencing a medical emergency</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Call your local emergency number immediately or go to the nearest emergency department.
            MedLens does not diagnose emergencies.
          </p>
          <Button variant="destructive" className="mt-3">
            <Phone data-icon="inline-start" />
            Call Emergency
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Nearby Facilities</h2>
        {hospitals.error ? (
          <ErrorState message={hospitals.error} onRetry={hospitals.reload} />
        ) : hospitals.loading ? (
          <CardSkeleton rows={4} />
        ) : (hospitals.data ?? []).length === 0 ? (
          <EmptyState icon={MapPin} title="No facilities found" description="No nearby hospitals available." />
        ) : (
          <div className="space-y-3">
            {hospitals.data!.map((h) => (
              <Card key={h.id}>
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">{h.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {h.type} · {h.address} · {h.distanceKm} km away
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {h.open24h ? <Badge tone="success">Open 24h</Badge> : <Badge tone="neutral">Limited hours</Badge>}
                        {h.emergency ? <Badge tone="danger">Emergency</Badge> : null}
                      </div>
                    </div>
                  </div>
                  <a href={`tel:${h.phone}`}>
                    <Button variant="outline" size="sm">
                      <Phone data-icon="inline-start" />
                      Call
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
