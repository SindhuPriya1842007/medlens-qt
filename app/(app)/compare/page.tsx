'use client'

import { GitCompare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAsync } from '@/lib/use-async'
import { reportsApi, labsApi } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import { StatusBadge } from '@/components/medlens-badges'
import { formatRange } from '@/lib/clinical'
import type { LabResult, MedicalReport } from '@/lib/types'

export default function ComparePage() {
  const reports = useAsync<MedicalReport[]>(() => reportsApi.list(), [])
  const labs = useAsync<LabResult[]>(() => labsApi.list(), [])
  const [reportA, setReportA] = useState('')
  const [reportB, setReportB] = useState('')

  const list = reports.data ?? []
  const idA = reportA || list[0]?.id || ''
  const idB = reportB || list[1]?.id || list[0]?.id || ''

  const comparison = useMemo(() => {
    if (!labs.data || !idA || !idB) return []
    const a = labs.data.filter((l) => l.reportId === idA)
    const b = labs.data.filter((l) => l.reportId === idB)
    const bMap = new Map(b.map((l) => [l.testName, l]))
    return a
      .filter((l) => bMap.has(l.testName))
      .map((l) => ({ test: l.testName, a: l, b: bMap.get(l.testName)! }))
  }, [labs.data, idA, idB])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Report Comparison</h1>
        <p className="mt-1 text-sm text-muted-foreground">Compare lab values between two reports. Only factual numerical changes are shown.</p>
      </div>

      {reports.error ? (
        <ErrorState message={reports.error} onRetry={reports.reload} />
      ) : reports.loading ? (
        <CardSkeleton rows={4} />
      ) : list.length < 2 ? (
        <EmptyState icon={GitCompare} title="Need at least 2 reports" description="Upload at least two reports to compare." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Previous Report</label>
              <Select value={idA} onChange={(e) => setReportA(e.target.value)}>
                {list.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.reportDate})</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Current Report</label>
              <Select value={idB} onChange={(e) => setReportB(e.target.value)}>
                {list.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.reportDate})</option>)}
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader><CardTitle>Shared Test Results</CardTitle></CardHeader>
            <CardContent>
              {comparison.length === 0 ? (
                <p className="text-sm text-muted-foreground">No shared tests between these reports.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-4 font-medium">Test</th>
                        <th className="pb-2 pr-4 font-medium">Previous</th>
                        <th className="pb-2 pr-4 font-medium">Current</th>
                        <th className="pb-2 pr-4 font-medium">Change</th>
                        <th className="pb-2 pr-4 font-medium">Ref Range</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((c) => {
                        const va = typeof c.a.value === 'number' ? c.a.value : 0
                        const vb = typeof c.b.value === 'number' ? c.b.value : 0
                        const diff = vb - va
                        return (
                          <tr key={c.test} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 font-medium">{c.test}</td>
                            <td className="py-3 pr-4">{c.a.value} {c.a.unit}</td>
                            <td className="py-3 pr-4">{c.b.value} {c.b.unit}</td>
                            <td className={`py-3 pr-4 ${diff > 0 ? 'text-danger' : diff < 0 ? 'text-info' : 'text-muted-foreground'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                            </td>
                            <td className="py-3 pr-4 text-muted-foreground">{formatRange(c.b.referenceRange)}</td>
                            <td className="py-3"><StatusBadge status={c.b.status} /></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          <p className="text-center text-xs text-muted-foreground">
            Only factual numerical changes are shown. MedLens does not claim a condition improved or worsened.
          </p>
        </>
      )}
    </div>
  )
}
