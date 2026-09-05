import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip } from '@/components/ui/tooltip'
import {
  CONFIDENCE_META,
  PROVENANCE_META,
  STATUS_META,
  VERIFICATION_META,
} from '@/lib/clinical'
import type {
  Confidence,
  LabStatus,
  ProvenanceSource,
  VerificationStatus,
} from '@/lib/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ status, className }: { status: LabStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <Badge tone={meta.tone} className={className}>
      <span aria-hidden="true" className="font-semibold">
        {meta.symbol}
      </span>
      {meta.label}
    </Badge>
  )
}

export function ProvenanceBadge({
  source,
  className,
}: {
  source: ProvenanceSource
  className?: string
}) {
  const meta = PROVENANCE_META[source]
  return (
    <Tooltip content={meta.description}>
      <Badge tone={meta.tone} className={className}>
        {source === 'AI_GENERATED' ? <Sparkles className="size-3" /> : null}
        {meta.label}
      </Badge>
    </Tooltip>
  )
}

export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: Confidence
  className?: string
}) {
  const meta = CONFIDENCE_META[confidence]
  return (
    <Tooltip content="Confidence represents extraction reliability. It does not represent medical certainty.">
      <Badge tone={meta.tone} className={className}>
        {meta.label}
      </Badge>
    </Tooltip>
  )
}

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus
  className?: string
}) {
  const meta = VERIFICATION_META[status]
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  )
}

/** Prominent "AI Generated" label used to mark any AI-produced content. */
export function AiLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning-foreground',
        className,
      )}
    >
      <Sparkles className="size-3" aria-hidden="true" />
      AI Generated
    </span>
  )
}
