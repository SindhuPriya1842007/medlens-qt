'use client'

import { UserRound } from 'lucide-react'
import { useAsync } from '@/lib/use-async'
import { patientsApi, allergiesApi, medicationsApi } from '@/lib/api'
import { ProvenanceBadge, VerificationBadge } from '@/components/medlens-badges'
import { ViewSourceButton } from '@/components/provenance-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ErrorState, CardSkeleton, EmptyState } from '@/components/states'
import type { Patient, Allergy, Medication, Provenance } from '@/lib/types'

export default function PatientPage() {
  const patient = useAsync<Patient>(() => patientsApi.get(), [])
  const allergies = useAsync<Allergy[]>(() => allergiesApi.list(), [])
  const meds = useAsync<Medication[]>(() => medicationsApi.list(), [])

  const p = patient.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Patient Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Structured patient information with source provenance.</p>
      </div>

      {patient.error ? (
        <ErrorState message={patient.error} onRetry={patient.reload} />
      ) : patient.loading ? (
        <CardSkeleton rows={5} />
      ) : p ? (
        <>
          <Card>
            <CardHeader><CardTitle>Demographics</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FieldRow label="Full Name" value={p.fullName} provenance={p.sex.provenance} />
              <FieldRow label="Age" value={`${p.age.value} years`} provenance={p.age.provenance} />
              <FieldRow label="Sex" value={p.sex.value} provenance={p.sex.provenance} />
              <FieldRow label="Date of Birth" value={p.dateOfBirth.value} provenance={p.dateOfBirth.provenance} />
              {p.bloodType ? <FieldRow label="Blood Type" value={p.bloodType.value} provenance={p.bloodType.provenance} /> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Symptoms</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {p.symptoms.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{s.value}</p>
                    <div className="mt-1 flex gap-2">
                      <ProvenanceBadge source={s.provenance.source} />
                      <VerificationBadge status={s.provenance.verification} />
                    </div>
                  </div>
                  <ViewSourceButton provenance={s.provenance} label="Source" fieldName={s.value} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Existing Conditions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {p.conditions.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{c.value}</p>
                    <div className="mt-1 flex gap-2">
                      <ProvenanceBadge source={c.provenance.source} />
                      <VerificationBadge status={c.provenance.verification} />
                    </div>
                  </div>
                  <ViewSourceButton provenance={c.provenance} label="Source" fieldName={c.value} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Allergies</CardTitle>
                <Badge tone="danger">{allergies.data?.length ?? 0}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {allergies.data?.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-danger/20 bg-danger/5 p-3">
                  <div>
                    <p className="text-sm font-medium">{a.allergen}</p>
                    <p className="text-xs text-muted-foreground">{a.reaction} · {a.severity}</p>
                    <div className="mt-1 flex gap-2">
                      <ProvenanceBadge source={a.provenance.source} />
                      <VerificationBadge status={a.provenance.verification} />
                    </div>
                  </div>
                  <ViewSourceButton provenance={a.provenance} label="Source" fieldName={a.allergen} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Medications</CardTitle>
                <Badge tone="info">{meds.data?.filter((m) => m.status === 'ACTIVE').length ?? 0} active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {meds.data?.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.strength ? `${m.strength} · ` : ''}{m.frequency ?? 'As needed'} · {m.status}
                    </p>
                    <div className="mt-1 flex gap-2">
                      <ProvenanceBadge source={m.provenance.source} />
                      <VerificationBadge status={m.provenance.verification} />
                    </div>
                  </div>
                  <ViewSourceButton provenance={m.provenance} label="Source" fieldName={m.name} />
                </div>
              ))}
            </CardContent>
          </Card>

          {p.otherInformation ? (
            <Card>
              <CardHeader><CardTitle>Other Information</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{p.otherInformation}</p></CardContent>
            </Card>
          ) : null}
        </>
      ) : (
        <EmptyState icon={UserRound} title="No patient data" description="Patient profile not found." />
      )}
    </div>
  )
}

function FieldRow({ label, value, provenance }: { label: string; value: string; provenance: Provenance }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
        <div className="mt-1 flex gap-2">
          <ProvenanceBadge source={provenance.source} />
          <VerificationBadge status={provenance.verification} />
        </div>
      </div>
      <ViewSourceButton provenance={provenance} label="Source" fieldName={label} />
    </div>
  )
}
