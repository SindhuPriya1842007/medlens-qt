'use client'

import { FileText, MapPin } from 'lucide-react'
import { useState } from 'react'
import { ProvenanceBadge, VerificationBadge } from '@/components/medlens-badges'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import type { Provenance } from '@/lib/types'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  )
}

export function ViewSourceButton({
  provenance,
  label = 'View Source',
  fieldName,
}: {
  provenance: Provenance
  label?: string
  fieldName?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="ghost" size="xs" onClick={() => setOpen(true)}>
        <MapPin data-icon="inline-start" />
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Source & provenance"
        description={
          fieldName ? `Where "${fieldName}" came from.` : 'Where this information came from.'
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ProvenanceBadge source={provenance.source} />
            <VerificationBadge status={provenance.verification} />
          </div>

          <div className="divide-y divide-border rounded-xl border border-border px-4">
            {provenance.report ? (
              <Row
                label="Report"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5 text-muted-foreground" />
                    {provenance.report}
                  </span>
                }
              />
            ) : null}
            {provenance.page ? <Row label="Page" value={`Page ${provenance.page}`} /> : null}
            {provenance.section ? <Row label="Section" value={provenance.section} /> : null}
            {provenance.extractedAt ? (
              <Row
                label="Extracted"
                value={new Date(provenance.extractedAt).toLocaleString()}
              />
            ) : null}
            <Row label="AI generated" value={provenance.aiGenerated ? 'Yes' : 'No'} />
          </div>

          {provenance.originalText ? (
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Original text / context
              </p>
              <p className="font-mono text-xs text-foreground">{provenance.originalText}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No original source snippet was captured for this field.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Provenance lets you confirm MedLens did not invent this information.
          </p>
        </div>
      </Dialog>
    </>
  )
}
