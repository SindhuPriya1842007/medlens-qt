'use client'

import { Activity, Dumbbell, HeartPulse, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAsync } from '@/lib/use-async'
import { exerciseApi } from '@/lib/api'
import { AiLabel, ProvenanceBadge, VerificationBadge } from '@/components/medlens-badges'
import { ViewSourceButton } from '@/components/provenance-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import { EXERCISE_TOPICS } from '@/lib/demo-data'
import type { ExerciseEntry, ExerciseIntensity } from '@/lib/types'

const INTENSITY_META: Record<ExerciseIntensity, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  LOW: { label: 'Low', tone: 'success' },
  MODERATE: { label: 'Moderate', tone: 'warning' },
  HIGH: { label: 'High', tone: 'danger' },
}

export default function ExercisePage() {
  const exercises = useAsync<ExerciseEntry[]>(() => exerciseApi.list(), [])
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!exercises.data) return []
    const q = query.toLowerCase()
    return exercises.data.filter(
      (e) => e.activity.toLowerCase().includes(q) || (e.notes ?? '').toLowerCase().includes(q),
    )
  }, [exercises.data, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Exercise & Physical Activity</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your physical activity and view general educational guidance.
          </p>
        </div>
        <Button>
          <Plus data-icon="inline-start" />
          Record Activity
        </Button>
      </div>

      {/* Activity history */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Activity History</h2>
          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activities…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 pl-9"
            />
          </div>
        </div>

        {exercises.error ? (
          <ErrorState message={exercises.error} onRetry={exercises.reload} />
        ) : exercises.loading ? (
          <CardSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="No activities recorded"
            description={query ? 'Try a different search.' : 'Record your first activity to start tracking.'}
            action={<Button size="sm"><Plus data-icon="inline-start" />Record Activity</Button>}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((e) => {
              const meta = INTENSITY_META[e.intensity]
              return (
                <Card key={e.id}>
                  <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HeartPulse className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{e.activity}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {e.date} · {e.durationMin} min
                        </p>
                        {e.notes ? <p className="mt-1 text-sm text-muted-foreground">{e.notes}</p> : null}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge tone={meta.tone}>{meta.label} intensity</Badge>
                          <ProvenanceBadge source={e.provenance.source} />
                          <VerificationBadge status={e.provenance.verification} />
                        </div>
                      </div>
                    </div>
                    <ViewSourceButton provenance={e.provenance} label="Source" fieldName={e.activity} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Educational guidance */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold">General Exercise Guidance</h2>
          <AiLabel />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXERCISE_TOPICS.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <CardTitle className="text-sm">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{topic.summary}</p>
                <ul className="mt-3 space-y-1.5">
                  {topic.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1 size-1 shrink-0 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          This is general educational information. It is not a medical treatment plan. Consult a qualified professional for individual guidance.
        </p>
      </div>
    </div>
  )
}
