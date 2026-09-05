// Clearly fictional demo dataset for MedLens. All values are invented for
// product demonstration and do not describe a real person.

import { computeStatus } from './clinical'
import type {
  Allergy,
  AuditEntry,
  ConflictItem,
  Hospital,
  LabResult,
  MedicalReport,
  Medication,
  Patient,
  TimelineEvent,
  User,
} from './types'

export const DEMO_USER: User = {
  id: 'user-demo',
  name: 'Jordan Ellery',
  email: 'jordan.ellery@example.com',
  createdAt: '2026-01-04T09:00:00.000Z',
}

export const DEMO_PATIENT: Patient = {
  id: 'patient-demo',
  userId: 'user-demo',
  fullName: 'Jordan Ellery',
  age: {
    value: 41,
    provenance: { source: 'USER_PROVIDED', aiGenerated: false, verification: 'VERIFIED' },
  },
  sex: {
    value: 'Female',
    provenance: { source: 'USER_PROVIDED', aiGenerated: false, verification: 'VERIFIED' },
  },
  dateOfBirth: {
    value: '1984-06-12',
    provenance: { source: 'USER_PROVIDED', aiGenerated: false, verification: 'VERIFIED' },
  },
  bloodType: {
    value: 'O+',
    provenance: {
      source: 'EXTRACTED_FROM_REPORT',
      report: 'Baseline Health Screen',
      reportId: 'rpt-001',
      page: 1,
      section: 'Patient Details',
      aiGenerated: false,
      verification: 'VERIFIED',
    },
  },
  symptoms: [
    {
      value: 'Occasional fatigue',
      provenance: { source: 'USER_PROVIDED', aiGenerated: false, verification: 'UNVERIFIED' },
    },
    {
      value: 'Mild dizziness in the morning',
      provenance: { source: 'USER_PROVIDED', aiGenerated: false, verification: 'UNVERIFIED' },
    },
  ],
  conditions: [
    {
      value: 'Iron-deficiency noted in prior screening',
      provenance: {
        source: 'EXTRACTED_FROM_REPORT',
        report: 'Blood Report',
        reportId: 'rpt-002',
        page: 1,
        section: 'Clinical Notes',
        aiGenerated: false,
        verification: 'NEEDS_REVIEW',
      },
    },
  ],
  otherInformation: 'Non-smoker. Exercises 3x per week.',
  createdAt: '2026-01-04T09:05:00.000Z',
  updatedAt: '2026-04-18T14:20:00.000Z',
}

interface LabSeed {
  category: string
  testName: string
  unit: string
  range: { low: number | null; high: number | null; text: string } | null
  points: { reportId: string; reportName: string; date: string; value: number }[]
  confidence?: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'>
}

const REPORTS_META = [
  { id: 'rpt-001', name: 'Baseline Health Screen', date: '2026-01-08' },
  { id: 'rpt-002', name: 'Blood Report', date: '2026-02-11' },
  { id: 'rpt-003', name: 'Lipid & Metabolic Panel', date: '2026-03-14' },
  { id: 'rpt-004', name: 'Comprehensive Blood Panel', date: '2026-04-18' },
]

const LAB_SEEDS: LabSeed[] = [
  {
    category: 'Hematology',
    testName: 'Hemoglobin',
    unit: 'g/dL',
    range: { low: 12, high: 16, text: '12–16 g/dL' },
    points: [
      { reportId: 'rpt-001', reportName: 'Baseline Health Screen', date: '2026-01-08', value: 11.6 },
      { reportId: 'rpt-002', reportName: 'Blood Report', date: '2026-02-11', value: 10.8 },
      { reportId: 'rpt-003', reportName: 'Lipid & Metabolic Panel', date: '2026-03-14', value: 11.0 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 11.2 },
    ],
  },
  {
    category: 'Hematology',
    testName: 'WBC',
    unit: 'x10⁹/L',
    range: { low: 4.0, high: 11.0, text: '4.0–11.0 x10⁹/L' },
    points: [
      { reportId: 'rpt-001', reportName: 'Baseline Health Screen', date: '2026-01-08', value: 6.1 },
      { reportId: 'rpt-002', reportName: 'Blood Report', date: '2026-02-11', value: 6.8 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 7.2 },
    ],
  },
  {
    category: 'Hematology',
    testName: 'Platelets',
    unit: 'x10⁹/L',
    range: { low: 150, high: 450, text: '150–450 x10⁹/L' },
    points: [
      { reportId: 'rpt-002', reportName: 'Blood Report', date: '2026-02-11', value: 262 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 288 },
    ],
  },
  {
    category: 'Metabolic',
    testName: 'Glucose (Fasting)',
    unit: 'mg/dL',
    range: { low: 70, high: 100, text: '70–100 mg/dL' },
    points: [
      { reportId: 'rpt-001', reportName: 'Baseline Health Screen', date: '2026-01-08', value: 92 },
      { reportId: 'rpt-003', reportName: 'Lipid & Metabolic Panel', date: '2026-03-14', value: 98 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 94 },
    ],
  },
  {
    category: 'Lipid Profile',
    testName: 'Total Cholesterol',
    unit: 'mg/dL',
    range: { low: 125, high: 200, text: '125–200 mg/dL' },
    points: [
      { reportId: 'rpt-003', reportName: 'Lipid & Metabolic Panel', date: '2026-03-14', value: 214 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 208 },
    ],
  },
  {
    category: 'Lipid Profile',
    testName: 'HDL',
    unit: 'mg/dL',
    range: { low: 40, high: 60, text: '40–60 mg/dL' },
    points: [
      { reportId: 'rpt-003', reportName: 'Lipid & Metabolic Panel', date: '2026-03-14', value: 52 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 54 },
    ],
  },
  {
    category: 'Lipid Profile',
    testName: 'LDL',
    unit: 'mg/dL',
    range: { low: null, high: 100, text: '< 100 mg/dL' },
    points: [
      { reportId: 'rpt-003', reportName: 'Lipid & Metabolic Panel', date: '2026-03-14', value: 132 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 126 },
    ],
  },
  {
    category: 'Lipid Profile',
    testName: 'Triglycerides',
    unit: 'mg/dL',
    range: { low: null, high: 150, text: '< 150 mg/dL' },
    points: [
      { reportId: 'rpt-003', reportName: 'Lipid & Metabolic Panel', date: '2026-03-14', value: 141 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 138 },
    ],
  },
  {
    category: 'Liver Function',
    testName: 'ALT',
    unit: 'U/L',
    range: { low: 7, high: 56, text: '7–56 U/L' },
    points: [
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 33 },
    ],
  },
  {
    category: 'Liver Function',
    testName: 'AST',
    unit: 'U/L',
    range: { low: 10, high: 40, text: '10–40 U/L' },
    points: [
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 29 },
    ],
  },
  {
    category: 'Kidney Function',
    testName: 'Creatinine',
    unit: 'mg/dL',
    range: { low: 0.6, high: 1.3, text: '0.6–1.3 mg/dL' },
    points: [
      { reportId: 'rpt-001', reportName: 'Baseline Health Screen', date: '2026-01-08', value: 0.9 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 0.88 },
    ],
  },
  {
    category: 'Thyroid',
    testName: 'TSH',
    unit: 'mIU/L',
    range: { low: 0.4, high: 4.0, text: '0.4–4.0 mIU/L' },
    points: [
      { reportId: 'rpt-002', reportName: 'Blood Report', date: '2026-02-11', value: 3.1 },
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 2.8 },
    ],
    confidence: { 'rpt-004': 'MEDIUM' },
  },
  {
    category: 'Vitamins',
    testName: 'Vitamin D',
    unit: 'ng/mL',
    range: null,
    points: [
      { reportId: 'rpt-004', reportName: 'Comprehensive Blood Panel', date: '2026-04-18', value: 35 },
    ],
    confidence: { 'rpt-004': 'LOW' },
  },
]

function buildLabResults(): LabResult[] {
  const results: LabResult[] = []
  for (const seed of LAB_SEEDS) {
    for (const point of seed.points) {
      const confidence = seed.confidence?.[point.reportId] ?? 'HIGH'
      const baseStatus = computeStatus(point.value, seed.range)
      const status = confidence === 'LOW' ? 'NEEDS_REVIEW' : baseStatus
      results.push({
        id: `lab-${seed.testName.replace(/\W+/g, '-').toLowerCase()}-${point.reportId}`,
        patientId: 'patient-demo',
        reportId: point.reportId,
        reportName: point.reportName,
        category: seed.category,
        testName: seed.testName,
        value: point.value,
        unit: seed.unit,
        referenceRange: seed.range,
        status,
        date: point.date,
        confidence,
        provenance: {
          source: confidence === 'MEDIUM' || confidence === 'LOW' ? 'EXTRACTED_FROM_REPORT' : 'EXTRACTED_FROM_REPORT',
          report: point.reportName,
          reportId: point.reportId,
          page: 1,
          section: seed.category,
          originalText: `${seed.testName} ${point.value} ${seed.unit}${seed.range ? ` (Ref: ${seed.range.text})` : ''}`,
          aiGenerated: false,
          verification: confidence === 'HIGH' ? 'VERIFIED' : 'NEEDS_REVIEW',
        },
      })
    }
  }
  return results
}

export const DEMO_LAB_RESULTS: LabResult[] = buildLabResults()

export const DEMO_REPORTS: MedicalReport[] = [
  {
    id: 'rpt-004',
    patientId: 'patient-demo',
    name: 'Comprehensive Blood Panel',
    fileName: 'comprehensive-blood-panel-apr.pdf',
    fileType: 'pdf',
    fileSizeKb: 486,
    reportType: 'Laboratory',
    reportDate: '2026-04-18',
    processingStatus: 'READY',
    verificationStatus: 'NEEDS_REVIEW',
    testsDetected: 12,
    outsideRange: 3,
    needsVerification: 2,
    withinRange: 7,
    aiSummary: [
      {
        heading: 'What this report contains',
        body: 'This laboratory report lists hematology, lipid, liver, kidney, thyroid and vitamin measurements collected on 18 Apr 2026.',
      },
      {
        heading: 'Values outside the provided reference ranges',
        body: 'The report shows Hemoglobin at 11.2 g/dL (reference 12–16), Total Cholesterol at 208 mg/dL (reference 125–200) and LDL at 126 mg/dL (reference < 100). These values are outside the reference ranges printed in the report.',
      },
      {
        heading: 'Values within the provided reference ranges',
        body: 'Fasting Glucose, HDL, Triglycerides, ALT, AST, Creatinine, Platelets and WBC are within the reference ranges provided in the report.',
      },
      {
        heading: 'Information requiring review',
        body: 'TSH was extracted with medium confidence and Vitamin D has no reference range printed in the report, so its status could not be determined. Please verify both against the source document.',
      },
    ],
    observations: [
      {
        text: 'Sample collected fasting. Hemolysis not observed.',
        provenance: {
          source: 'EXTRACTED_FROM_REPORT',
          report: 'Comprehensive Blood Panel',
          reportId: 'rpt-004',
          page: 1,
          section: 'Observations',
          aiGenerated: false,
          verification: 'VERIFIED',
        },
      },
    ],
    createdAt: '2026-04-18T13:55:00.000Z',
    processedAt: '2026-04-18T13:57:20.000Z',
  },
  {
    id: 'rpt-003',
    patientId: 'patient-demo',
    name: 'Lipid & Metabolic Panel',
    fileName: 'lipid-metabolic-mar.pdf',
    fileType: 'pdf',
    fileSizeKb: 322,
    reportType: 'Laboratory',
    reportDate: '2026-03-14',
    processingStatus: 'READY',
    verificationStatus: 'VERIFIED',
    testsDetected: 6,
    outsideRange: 2,
    needsVerification: 0,
    withinRange: 4,
    aiSummary: [
      {
        heading: 'What this report contains',
        body: 'A lipid profile and fasting glucose measurement collected on 14 Mar 2026.',
      },
      {
        heading: 'Values outside the provided reference ranges',
        body: 'Total Cholesterol (214 mg/dL, reference 125–200) and LDL (132 mg/dL, reference < 100) are above the reference ranges printed in the report.',
      },
    ],
    observations: [],
    createdAt: '2026-03-14T10:10:00.000Z',
    processedAt: '2026-03-14T10:11:40.000Z',
  },
  {
    id: 'rpt-002',
    patientId: 'patient-demo',
    name: 'Blood Report',
    fileName: 'blood-report-feb.jpg',
    fileType: 'image',
    fileSizeKb: 1180,
    reportType: 'Laboratory',
    reportDate: '2026-02-11',
    processingStatus: 'READY',
    verificationStatus: 'VERIFIED',
    testsDetected: 3,
    outsideRange: 1,
    needsVerification: 0,
    withinRange: 2,
    aiSummary: [
      {
        heading: 'What this report contains',
        body: 'A hematology snapshot with Hemoglobin, WBC and TSH collected on 11 Feb 2026.',
      },
      {
        heading: 'Values outside the provided reference ranges',
        body: 'Hemoglobin (10.8 g/dL, reference 12–16) is below the reference range printed in the report.',
      },
    ],
    observations: [
      {
        text: 'Clinical note mentions prior iron-deficiency screening.',
        provenance: {
          source: 'EXTRACTED_FROM_REPORT',
          report: 'Blood Report',
          reportId: 'rpt-002',
          page: 1,
          section: 'Clinical Notes',
          aiGenerated: false,
          verification: 'NEEDS_REVIEW',
        },
      },
    ],
    createdAt: '2026-02-11T09:30:00.000Z',
    processedAt: '2026-02-11T09:31:15.000Z',
  },
  {
    id: 'rpt-001',
    patientId: 'patient-demo',
    name: 'Baseline Health Screen',
    fileName: 'baseline-screen-jan.pdf',
    fileType: 'pdf',
    fileSizeKb: 274,
    reportType: 'Laboratory',
    reportDate: '2026-01-08',
    processingStatus: 'READY',
    verificationStatus: 'VERIFIED',
    testsDetected: 4,
    outsideRange: 1,
    needsVerification: 0,
    withinRange: 3,
    aiSummary: [
      {
        heading: 'What this report contains',
        body: 'A baseline screen with Hemoglobin, WBC, Glucose and Creatinine collected on 8 Jan 2026.',
      },
      {
        heading: 'Values outside the provided reference ranges',
        body: 'Hemoglobin (11.6 g/dL, reference 12–16) is slightly below the reference range printed in the report.',
      },
    ],
    observations: [],
    createdAt: '2026-01-08T08:45:00.000Z',
    processedAt: '2026-01-08T08:46:05.000Z',
  },
]

export const DEMO_MEDICATIONS: Medication[] = [
  {
    id: 'med-001',
    patientId: 'patient-demo',
    name: 'Ferrous sulfate',
    strength: '325 mg',
    frequency: 'Once daily',
    startDate: '2026-02-12',
    endDate: null,
    status: 'ACTIVE',
    provenance: {
      source: 'EXTRACTED_FROM_REPORT',
      report: 'Blood Report',
      reportId: 'rpt-002',
      page: 1,
      section: 'Medications',
      originalText: 'Ferrous sulfate 325 mg once daily',
      aiGenerated: false,
      verification: 'NEEDS_REVIEW',
    },
  },
  {
    id: 'med-002',
    patientId: 'patient-demo',
    name: 'Vitamin D3',
    strength: '1000 IU',
    frequency: 'Once daily',
    startDate: '2026-01-10',
    endDate: null,
    status: 'ACTIVE',
    provenance: {
      source: 'USER_PROVIDED',
      aiGenerated: false,
      verification: 'VERIFIED',
    },
  },
  {
    id: 'med-003',
    patientId: 'patient-demo',
    name: 'Cetirizine',
    strength: '10 mg',
    frequency: 'As needed',
    startDate: null,
    endDate: null,
    status: 'REPORTED',
    provenance: {
      source: 'USER_PROVIDED',
      aiGenerated: false,
      verification: 'UNVERIFIED',
    },
  },
]

export const DEMO_ALLERGIES: Allergy[] = [
  {
    id: 'alg-001',
    patientId: 'patient-demo',
    allergen: 'Penicillin',
    reaction: 'Skin rash',
    severity: 'MODERATE',
    provenance: {
      source: 'USER_PROVIDED',
      aiGenerated: false,
      verification: 'VERIFIED',
    },
  },
  {
    id: 'alg-002',
    patientId: 'patient-demo',
    allergen: 'Pollen',
    reaction: 'Seasonal rhinitis',
    severity: 'MILD',
    provenance: {
      source: 'USER_PROVIDED',
      aiGenerated: false,
      verification: 'UNVERIFIED',
    },
  },
]

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-008',
    type: 'AI_SUMMARY',
    title: 'AI analysis generated',
    description: 'Brief report analysis generated for Comprehensive Blood Panel.',
    date: '2026-04-18T13:57:30.000Z',
    source: 'AI Assistance',
    actor: 'MedLens AI',
  },
  {
    id: 'tl-007',
    type: 'REPORT_PROCESSED',
    title: 'Report processed',
    description: 'Comprehensive Blood Panel structured into 12 lab values.',
    date: '2026-04-18T13:57:20.000Z',
    source: 'Processing Pipeline',
    actor: 'System',
  },
  {
    id: 'tl-006',
    type: 'REPORT_UPLOAD',
    title: 'Report uploaded',
    description: 'comprehensive-blood-panel-apr.pdf uploaded.',
    date: '2026-04-18T13:55:00.000Z',
    source: 'Upload',
    actor: 'Jordan Ellery',
  },
  {
    id: 'tl-005',
    type: 'VERIFICATION',
    title: 'Value verified',
    description: 'LDL value confirmed for Lipid & Metabolic Panel.',
    date: '2026-03-14T10:20:00.000Z',
    source: 'Verification Center',
    actor: 'Jordan Ellery',
  },
  {
    id: 'tl-004',
    type: 'REPORT_UPLOAD',
    title: 'Report uploaded',
    description: 'lipid-metabolic-mar.pdf uploaded.',
    date: '2026-03-14T10:10:00.000Z',
    source: 'Upload',
    actor: 'Jordan Ellery',
  },
  {
    id: 'tl-003',
    type: 'MEDICATION',
    title: 'Medication recorded',
    description: 'Ferrous sulfate 325 mg extracted from Blood Report.',
    date: '2026-02-12T09:00:00.000Z',
    source: 'Blood Report',
    actor: 'System',
  },
  {
    id: 'tl-002',
    type: 'REPORT_UPLOAD',
    title: 'Report uploaded',
    description: 'blood-report-feb.jpg uploaded.',
    date: '2026-02-11T09:30:00.000Z',
    source: 'Upload',
    actor: 'Jordan Ellery',
  },
  {
    id: 'tl-001',
    type: 'PATIENT_INFO',
    title: 'Patient information added',
    description: 'Initial patient profile created.',
    date: '2026-01-04T09:05:00.000Z',
    source: 'Patient Profile',
    actor: 'Jordan Ellery',
  },
]

export const DEMO_AUDIT: AuditEntry[] = [
  {
    id: 'aud-010',
    action: 'AI_SUMMARY_GENERATED',
    resource: 'Report',
    resourceId: 'rpt-004',
    timestamp: '2026-04-18T13:57:30.000Z',
    actor: 'MedLens AI',
    description: 'AI analysis generated for Comprehensive Blood Panel.',
  },
  {
    id: 'aud-009',
    action: 'REPORT_PROCESSED',
    resource: 'Report',
    resourceId: 'rpt-004',
    timestamp: '2026-04-18T13:57:20.000Z',
    actor: 'System',
    description: 'Structured 12 lab values from Comprehensive Blood Panel.',
  },
  {
    id: 'aud-008',
    action: 'REPORT_UPLOAD',
    resource: 'Report',
    resourceId: 'rpt-004',
    timestamp: '2026-04-18T13:55:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Uploaded comprehensive-blood-panel-apr.pdf (486 KB).',
  },
  {
    id: 'aud-007',
    action: 'DATA_MODIFIED',
    resource: 'Patient',
    resourceId: 'patient-demo',
    timestamp: '2026-04-18T14:20:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Updated reported symptoms.',
  },
  {
    id: 'aud-006',
    action: 'VERIFICATION',
    resource: 'LabResult',
    resourceId: 'lab-ldl-rpt-003',
    timestamp: '2026-03-14T10:20:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Confirmed LDL value 132 mg/dL.',
  },
  {
    id: 'aud-005',
    action: 'REPORT_DOWNLOAD',
    resource: 'Report',
    resourceId: 'rpt-003',
    timestamp: '2026-03-14T10:25:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Exported Lipid & Metabolic Panel record as PDF.',
  },
  {
    id: 'aud-004',
    action: 'COMPARISON',
    resource: 'Report',
    resourceId: 'rpt-003',
    timestamp: '2026-03-14T10:22:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Compared Lipid & Metabolic Panel with Baseline Health Screen.',
  },
  {
    id: 'aud-003',
    action: 'REPORT_UPLOAD',
    resource: 'Report',
    resourceId: 'rpt-002',
    timestamp: '2026-02-11T09:30:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Uploaded blood-report-feb.jpg (1180 KB).',
  },
  {
    id: 'aud-002',
    action: 'DATA_MODIFIED',
    resource: 'Patient',
    resourceId: 'patient-demo',
    timestamp: '2026-01-04T09:05:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Created patient profile.',
  },
  {
    id: 'aud-001',
    action: 'LOGIN',
    resource: 'Session',
    timestamp: '2026-01-04T09:00:00.000Z',
    actor: 'Jordan Ellery',
    description: 'Signed in to MedLens.',
  },
]

export const DEMO_CONFLICTS: ConflictItem[] = [
  {
    id: 'cft-001',
    field: 'Age',
    category: 'Patient Information',
    sourceA: { label: 'User provided', value: '41 years', report: 'Patient Profile' },
    sourceB: { label: 'Extracted from report', value: '40 years', report: 'Blood Report (Feb)' },
    status: 'OPEN',
  },
  {
    id: 'cft-002',
    field: 'Hemoglobin reference range',
    category: 'Laboratory',
    sourceA: { label: 'Baseline Health Screen', value: '12–16 g/dL', report: 'Baseline Health Screen' },
    sourceB: { label: 'Blood Report', value: '11.5–15.5 g/dL', report: 'Blood Report (Feb)' },
    status: 'OPEN',
  },
]

export const DEMO_HOSPITALS: Hospital[] = [
  {
    id: 'hsp-001',
    name: 'Riverside General Hospital',
    type: 'Emergency Department',
    address: '820 Riverside Ave',
    distanceKm: 2.4,
    phone: '+1 (555) 018-2200',
    open24h: true,
    emergency: true,
  },
  {
    id: 'hsp-002',
    name: 'Northgate Medical Center',
    type: 'Hospital',
    address: '145 Northgate Blvd',
    distanceKm: 4.1,
    phone: '+1 (555) 044-8100',
    open24h: true,
    emergency: true,
  },
  {
    id: 'hsp-003',
    name: 'Elmwood Urgent Care',
    type: 'Urgent Care',
    address: '30 Elmwood St',
    distanceKm: 1.2,
    phone: '+1 (555) 077-3390',
    open24h: false,
    emergency: false,
  },
  {
    id: 'hsp-004',
    name: 'Bay City Emergency Clinic',
    type: 'Emergency Department',
    address: '512 Harbor Rd',
    distanceKm: 6.8,
    phone: '+1 (555) 090-1120',
    open24h: true,
    emergency: true,
  },
]

export const NUTRITION_TOPICS = [
  {
    id: 'iron',
    title: 'Iron in everyday food',
    summary:
      'General information about dietary iron and foods that commonly contain it. Educational only.',
    points: [
      'Iron is found in foods such as legumes, leafy greens, tofu, and lean meats.',
      'Vitamin C-rich foods can support iron absorption from plant sources.',
      'General guidance is not a substitute for advice from a qualified clinician.',
    ],
  },
  {
    id: 'hydration',
    title: 'Hydration basics',
    summary: 'General educational information about staying hydrated through the day.',
    points: [
      'Water needs vary by activity, climate, and individual factors.',
      'Many foods, including fruits and vegetables, contribute to hydration.',
      'Consult a professional for individual hydration needs.',
    ],
  },
  {
    id: 'lipids',
    title: 'Understanding dietary fats',
    summary: 'General overview of fat types commonly discussed in nutrition education.',
    points: [
      'Nutrition labels group fats into saturated, unsaturated, and trans fats.',
      'A balanced diet includes a variety of nutrient sources.',
      'This is general education, not a treatment plan for any condition.',
    ],
  },
  {
    id: 'balanced',
    title: 'Building a balanced plate',
    summary: 'A general framework often used in nutrition education.',
    points: [
      'A common approach balances vegetables, proteins, whole grains, and fruit.',
      'Portion needs differ from person to person.',
      'Personalized dietary plans should come from a qualified professional.',
    ],
  },
]
