'use client'

import { Activity, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAsync } from '@/lib/use-async'
import { labsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import { StatusBadge } from '@/components/medlens-badges'
import { formatRange } from '@/lib/clinical'
import type { LabResult } from '@/lib/types'

export default function LabsPage() {
  const labs = useAsync<LabResult[]>(() => labsApi.list(), [])
  const testNames = useMemo(() => {
    if (!labs.data) return []
    return [...new Set(labs.data.map((l) => l.testName))]
  }, [labs.data])
  const [selected, setSelected] = useState('')

  const testName = selected || testNames[0] || ''
  const trends = useMemo(() => {
    if (!testName) return []
    return labs.data?.filter((l) => l.testName === testName).sort((a, b) => +new Date(a.date) - +new Date(b.date)) ?? []
  }, [labs.data, testName])

  const values = trends.map((t) => typeof t.value === 'number' ? t.value : 0)
  const maxVal = Math.max(...values, ...(trends[0]?.referenceRange?.high ? [trends[0].referenceRange.high] : []))
  const minVal = Math.min(...values, ...(trends[0]?.referenceRange?.low ? [trends[0].referenceRange.low] : []))
  const range = maxVal - minVal || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Lab Trends</h1>
        <p className="mt-1 text-sm text-muted-foreground">Historical lab values visualized from structured data.</p>
      </div>

      {labs.error ? (
        <ErrorState message={labs.error} onRetry={labs.reload} />
      ) : labs.loading ? (
        <CardSkeleton rows={6} />
      ) : testNames.length === 0 ? (
        <EmptyState icon={Activity} title="No lab data" description="No structured lab results available." />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Test:</span>
            <Select value={testName} onChange={(e) => setSelected(e.target.value)} className="max-w-xs">
              {testNames.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>

          {trends.length > 0 && trends[0].referenceRange ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{testName} Trend</CardTitle>
                  <span className="text-xs text-muted-foreground">Ref: {formatRange(trends[0].referenceRange)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-end gap-4">
                  {trends.map((t, i) => {
                    const v = typeof t.value === 'number' ? t.value : 0
                    const h = ((v - minVal) / range) * 100
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-2">
                        <span className="text-xs font-medium">{t.value}</span>
                        <div className="flex w-full flex-1 items-end">
                          <div
                            className={`w-full rounded-t-md ${t.status === 'HIGH' || t.status === 'LOW' ? 'bg-danger/70' : 'bg-primary/70'}`}
                            style={{ height: `${Math.max(h, 4)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{t.date.slice(5)}</span>
                      </div>
                    )
                  })}
                </div>
                {trends[0].referenceRange.high != null && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Reference range: {trends[0].referenceRange.text}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader><CardTitle>Historical Values</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">Date</th>
                      <th className="pb-2 pr-4 font-medium">Value</th>
                      <th className="pb-2 pr-4 font-medium">Unit</th>
                      <th className="pb-2 pr-4 font-medium">Reference Range</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trends.map((l) => (
                      <tr key={l.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4">{l.date}</td>
                        <td className="py-3 pr-4 font-medium">{l.value}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{l.unit}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{formatRange(l.referenceRange)}</td>
                        <td className="py-3"><StatusBadge status={l.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Charts use structured data only. MedLens does not provide medical diagnosis or treatment decisions.
      </p>
    </div>
  )
}
