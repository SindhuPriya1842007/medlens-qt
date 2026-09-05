'use client'

import { ShieldCheck } from 'lucide-react'
import { useAsync } from '@/lib/use-async'
import { auditApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import type { AuditEntry } from '@/lib/types'

export default function AuditPage() {
  const audit = useAsync<AuditEntry[]>(() => auditApi.list(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Audit History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track of meaningful changes and actions.</p>
      </div>

      {audit.error ? (
        <ErrorState message={audit.error} onRetry={audit.reload} />
      ) : audit.loading ? (
        <CardSkeleton rows={6} />
      ) : (audit.data ?? []).length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No audit entries" description="No actions have been logged." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="p-4 font-medium">Action</th>
                    <th className="p-4 font-medium">Resource</th>
                    <th className="p-4 font-medium">Actor</th>
                    <th className="p-4 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.data!.map((a) => (
                    <tr key={a.id} className="border-b border-border/50 last:border-0">
                      <td className="p-4">
                        <p className="font-medium">{a.action}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                      </td>
                      <td className="p-4">
                        <Badge tone="neutral">{a.resource}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{a.actor}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(a.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
