// Domain service layer. Each object maps to a backend resource group
// (/api/auth, /api/patients, ...). Components import these, never the client
// or demo data directly.

import {
  DEMO_ALLERGIES,
  DEMO_AUDIT,
  DEMO_CONFLICTS,
  DEMO_HOSPITALS,
  DEMO_LAB_RESULTS,
  DEMO_MEDICATIONS,
  DEMO_PATIENT,
  DEMO_REPORTS,
  DEMO_TIMELINE,
  DEMO_USER,
} from '@/lib/demo-data'
import type {
  Allergy,
  AuditEntry,
  ConflictItem,
  DashboardStats,
  Hospital,
  LabResult,
  MedicalReport,
  Medication,
  Patient,
  TimelineEvent,
  User,
} from '@/lib/types'
import { request } from './client'

export const authApi = {
  me: () => request<User>('/auth/me', { mock: () => DEMO_USER }),
  login: (email: string, _password: string) =>
    request<User>('/auth/login', {
      method: 'POST',
      body: { email },
      mock: () => ({ ...DEMO_USER, email }),
    }),
  register: (name: string, email: string, _password: string) =>
    request<User>('/auth/register', {
      method: 'POST',
      body: { name, email },
      mock: () => ({ ...DEMO_USER, name, email }),
    }),
}

export const patientsApi = {
  get: () => request<Patient>('/patients/patient-demo', { mock: () => DEMO_PATIENT }),
}

export const reportsApi = {
  list: () =>
    request<MedicalReport[]>('/reports', { mock: () => DEMO_REPORTS }),
  get: (id: string) =>
    request<MedicalReport | undefined>(`/reports/${id}`, {
      mock: () => DEMO_REPORTS.find((r) => r.id === id),
    }),
}

export const labsApi = {
  list: () => request<LabResult[]>('/labs', { mock: () => DEMO_LAB_RESULTS }),
  byReport: (reportId: string) =>
    request<LabResult[]>(`/labs?reportId=${reportId}`, {
      mock: () => DEMO_LAB_RESULTS.filter((l) => l.reportId === reportId),
    }),
  trends: (testName: string) =>
    request<LabResult[]>(`/labs/trends?test=${encodeURIComponent(testName)}`, {
      mock: () =>
        DEMO_LAB_RESULTS.filter((l) => l.testName === testName).sort(
          (a, b) => +new Date(a.date) - +new Date(b.date),
        ),
    }),
  conflicts: () =>
    request<ConflictItem[]>('/labs/conflicts', { mock: () => DEMO_CONFLICTS }),
}

export const medicationsApi = {
  list: () => request<Medication[]>('/medications', { mock: () => DEMO_MEDICATIONS }),
}

export const allergiesApi = {
  list: () => request<Allergy[]>('/allergies', { mock: () => DEMO_ALLERGIES }),
}

export const timelineApi = {
  list: () => request<TimelineEvent[]>('/timeline', { mock: () => DEMO_TIMELINE }),
}

export const auditApi = {
  list: () => request<AuditEntry[]>('/audit', { mock: () => DEMO_AUDIT }),
}

export const emergencyApi = {
  nearby: (_coords?: { lat: number; lng: number }) =>
    request<Hospital[]>('/emergency/nearby', {
      mock: () => [...DEMO_HOSPITALS].sort((a, b) => a.distanceKm - b.distanceKm),
    }),
}

export const dashboardApi = {
  stats: () =>
    request<DashboardStats>('/dashboard/stats', {
      mock: () => ({
        totalReports: DEMO_REPORTS.length,
        recentReports: DEMO_REPORTS.filter(
          (r) => +new Date(r.reportDate) > +new Date('2026-03-01'),
        ).length,
        abnormalValues: DEMO_LAB_RESULTS.filter(
          (l) => l.status === 'LOW' || l.status === 'HIGH',
        ).length,
        pendingVerification: DEMO_LAB_RESULTS.filter(
          (l) => l.status === 'NEEDS_REVIEW' || l.confidence !== 'HIGH',
        ).length,
        activeMedications: DEMO_MEDICATIONS.filter((m) => m.status === 'ACTIVE').length,
        allergies: DEMO_ALLERGIES.length,
      }),
      latency: [200, 420],
    }),
}
