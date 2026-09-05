// Shared domain types for MedLens. These mirror the backend MongoDB models so
// the frontend service layer can be pointed at a real Node/Express API later.

export type ProvenanceSource =
  | 'USER_PROVIDED'
  | 'EXTRACTED_FROM_REPORT'
  | 'AI_GENERATED'
  | 'VERIFIED_BY_USER'

export type LabStatus = 'LOW' | 'NORMAL' | 'HIGH' | 'NOT_DETERMINED' | 'NEEDS_REVIEW'

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW'

export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'UNVERIFIED'

export type ProcessingStatus =
  | 'UPLOADING'
  | 'READING'
  | 'EXTRACTING'
  | 'STRUCTURING'
  | 'VALIDATING'
  | 'READY'
  | 'ERROR'

export interface Provenance {
  source: ProvenanceSource
  report?: string
  reportId?: string
  page?: number
  section?: string
  originalText?: string
  extractedAt?: string
  aiGenerated: boolean
  verification: VerificationStatus
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface Patient {
  id: string
  userId: string
  fullName: string
  age: { value: number; provenance: Provenance }
  sex: { value: string; provenance: Provenance }
  dateOfBirth: { value: string; provenance: Provenance }
  symptoms: { value: string; provenance: Provenance }[]
  conditions: { value: string; provenance: Provenance }[]
  bloodType?: { value: string; provenance: Provenance }
  otherInformation?: string
  createdAt: string
  updatedAt: string
}

export interface LabResult {
  id: string
  patientId: string
  reportId: string
  reportName: string
  category: string
  testName: string
  value: number | string
  unit: string
  referenceRange: { low: number | null; high: number | null; text: string } | null
  status: LabStatus
  date: string
  confidence: Confidence
  provenance: Provenance
}

export interface ReportSummarySection {
  heading: string
  body: string
}

export interface MedicalReport {
  id: string
  patientId: string
  name: string
  fileName: string
  fileType: 'pdf' | 'image'
  fileSizeKb: number
  reportType: string
  reportDate: string
  processingStatus: ProcessingStatus
  verificationStatus: VerificationStatus
  testsDetected: number
  outsideRange: number
  needsVerification: number
  withinRange: number
  aiSummary: ReportSummarySection[]
  observations: { text: string; provenance: Provenance }[]
  createdAt: string
  processedAt: string
}

export interface Medication {
  id: string
  patientId: string
  name: string
  strength: string | null
  frequency: string | null
  startDate: string | null
  endDate: string | null
  status: 'ACTIVE' | 'DISCONTINUED' | 'REPORTED'
  provenance: Provenance
}

export interface Allergy {
  id: string
  patientId: string
  allergen: string
  reaction: string | null
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'UNKNOWN'
  provenance: Provenance
}

export type TimelineEventType =
  | 'PATIENT_INFO'
  | 'REPORT_UPLOAD'
  | 'REPORT_PROCESSED'
  | 'VALUE_EXTRACTED'
  | 'VERIFICATION'
  | 'MEDICATION'
  | 'COMPARISON'
  | 'AI_SUMMARY'
  | 'DOWNLOAD'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  date: string
  source: string
  actor: string
}

export interface AuditEntry {
  id: string
  action: string
  resource: string
  resourceId?: string
  timestamp: string
  actor: string
  description: string
}

export interface ConflictItem {
  id: string
  field: string
  category: string
  sourceA: { label: string; value: string; report: string }
  sourceB: { label: string; value: string; report: string }
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED'
}

export interface Hospital {
  id: string
  name: string
  type: string
  address: string
  distanceKm: number
  phone: string
  open24h: boolean
  emergency: boolean
}

export interface DashboardStats {
  totalReports: number
  recentReports: number
  abnormalValues: number
  pendingVerification: number
  activeMedications: number
  allergies: number
}
