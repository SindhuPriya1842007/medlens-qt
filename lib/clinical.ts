// Deterministic clinical helpers. Reference-range comparison, status derivation
// and label metadata are handled here with plain code (never by AI), matching
// MedLens' responsible-AI separation of concerns.

import type {
  Confidence,
  LabStatus,
  ProvenanceSource,
  VerificationStatus,
} from './types'

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary'

interface Range {
  low: number | null
  high: number | null
  text: string
}

/** Derive a lab status strictly from the reference range provided by the source. */
export function computeStatus(value: number | string, range: Range | null): LabStatus {
  if (range === null) return 'NOT_DETERMINED'
  if (typeof value !== 'number') return 'NOT_DETERMINED'
  if (range.low !== null && value < range.low) return 'LOW'
  if (range.high !== null && value > range.high) return 'HIGH'
  return 'NORMAL'
}

export const STATUS_META: Record<
  LabStatus,
  { label: string; tone: Tone; symbol: string; description: string }
> = {
  LOW: {
    label: 'Low',
    tone: 'info',
    symbol: '↓',
    description: 'Below the reference range provided in the report.',
  },
  NORMAL: {
    label: 'Within range',
    tone: 'success',
    symbol: '✓',
    description: 'Within the reference range provided in the report.',
  },
  HIGH: {
    label: 'High',
    tone: 'danger',
    symbol: '↑',
    description: 'Above the reference range provided in the report.',
  },
  NOT_DETERMINED: {
    label: 'Not determined',
    tone: 'neutral',
    symbol: '—',
    description: 'Reference range unavailable — status not determined.',
  },
  NEEDS_REVIEW: {
    label: 'Needs review',
    tone: 'warning',
    symbol: '!',
    description: 'Extraction confidence is low. Please verify against the source.',
  },
}

export const PROVENANCE_META: Record<
  ProvenanceSource,
  { label: string; tone: Tone; description: string }
> = {
  USER_PROVIDED: {
    label: 'User provided',
    tone: 'primary',
    description: 'Entered directly by you.',
  },
  EXTRACTED_FROM_REPORT: {
    label: 'Extracted from report',
    tone: 'info',
    description: 'Read from an uploaded document by the extraction pipeline.',
  },
  AI_GENERATED: {
    label: 'AI generated',
    tone: 'warning',
    description: 'Produced by AI assistance. Informational, not a medical fact.',
  },
  VERIFIED_BY_USER: {
    label: 'Verified by user',
    tone: 'success',
    description: 'Reviewed and confirmed by a human.',
  },
}

export const CONFIDENCE_META: Record<
  Confidence,
  { label: string; tone: Tone }
> = {
  HIGH: { label: 'High confidence', tone: 'success' },
  MEDIUM: { label: 'Medium confidence', tone: 'warning' },
  LOW: { label: 'Needs review', tone: 'danger' },
}

export const VERIFICATION_META: Record<
  VerificationStatus,
  { label: string; tone: Tone }
> = {
  VERIFIED: { label: 'Verified', tone: 'success' },
  NEEDS_REVIEW: { label: 'Needs review', tone: 'warning' },
  UNVERIFIED: { label: 'Unverified', tone: 'neutral' },
}

export function toneClasses(tone: Tone): string {
  switch (tone) {
    case 'success':
      return 'bg-success/12 text-success border-success/25'
    case 'warning':
      return 'bg-warning/15 text-warning-foreground border-warning/30'
    case 'danger':
      return 'bg-danger/12 text-danger border-danger/25'
    case 'info':
      return 'bg-info/12 text-info border-info/25'
    case 'primary':
      return 'bg-primary/12 text-primary border-primary/25'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function formatRange(range: Range | null): string {
  if (!range) return 'Not provided'
  return range.text
}
