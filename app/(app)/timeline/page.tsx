'use client'

import { Activity, FileText, Pill, ShieldCheck, Timer, UserRound } from 'lucide-react'
import { useAsync } from '@/lib/use-async'
import { timelineApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import type { TimelineEvent, TimelineEventType } from '@/lib/types'

const TYPE_ICON: Record<TimelineEventType, typeof Activity> = {
  PATIENT_INFO: UserRound,
  REPORT_UPLOAD: FileText,
  REPORT_PROCESSED: Activity,
  VALUE_EXTRACTED: Activity,
  VERIFICATION: ShieldCheck,
  MEDICATION: Pill,
  COMPARISON: Activity,
  AI_SUMMARY: Activity,
  DOWNLOAD: FileText,
}

const TYPE_TONE: Record<TimelineEventType, 'primary' | 'info' | 'success' | 'warning' | 'neutral'> = {
  PATIENT_INFO: 'primary',
  REPORT_UPLOAD: 'info',
  REPORT_PROCESSED: 'info',
  VALUE_EXTRACTED: 'neutral',
  VERIFICATION: 'success',
  MEDICATION: 'warning',
  COMPARISON: 'neutral',
  AI_SUMMARY: 'warning',
  DOWNLOAD: 'neutral',
}

export default function TimelinePage() {
  const timeline = useAsync<TimelineEvent[]>(() => timelineApi.list(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Medical Timeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">Chronological view of reports, events, and updates.</p>
      </div>

      {timeline.error ? (
        <ErrorState message={timeline.error} onRetry={timeline.reload} />
      ) : timeline.loading ? (
        <CardSkeleton rows={6} />
      ) : (timeline.data ?? []).length === 0 ? (
        <EmptyState icon={Timer} title="No events" description="No timeline events recorded." />
      ) : (
        <div className="relative space-y-4 before:absolute before:left-[19px] before:top-2 before:h-full before:w-px before:bg-border">
          {timeline.data!.map((e) => {
            const Icon = TYPE_ICON[e.type] ?? Activity
            return (
              <div key={e.id} className="relative flex gap-4">
                <div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                  <Icon className="size-4 text-primary" />
                </div>
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{e.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{e.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(e.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} · {e.actor}
                        </p>
                      </div>
                      <Badge tone={TYPE_TONE[e.type]}>{e.source}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
