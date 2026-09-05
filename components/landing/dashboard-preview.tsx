import { Activity, FileText, ShieldCheck, TriangleAlert } from 'lucide-react'
import { AiLabel } from '@/components/medlens-badges'
import { Badge } from '@/components/ui/badge'

const trend = [11.6, 10.8, 11.0, 11.2]
const max = 12.5
const min = 10

export function DashboardPreview() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-xl shadow-primary/5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-danger/60" />
          <div className="size-2.5 rounded-full bg-warning/60" />
          <div className="size-2.5 rounded-full bg-success/60" />
        </div>
        <Badge tone="primary">Structured record</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <PreviewStat icon={FileText} label="Reports" value="4" tone="primary" />
        <PreviewStat icon={TriangleAlert} label="Outside range" value="3" tone="danger" />
        <PreviewStat icon={ShieldCheck} label="Verified" value="7" tone="success" />
      </div>

      <div className="mt-3 rounded-xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <span className="text-sm font-medium">Hemoglobin trend</span>
          </div>
          <span className="text-xs text-muted-foreground">g/dL</span>
        </div>
        <div className="flex h-24 items-end gap-3">
          {trend.map((v, i) => {
            const h = ((v - min) / (max - min)) * 100
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-md bg-primary/80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{v}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-warning-foreground">
            Brief report analysis
          </span>
          <AiLabel />
        </div>
        <p className="text-xs leading-relaxed text-foreground/80">
          {'The report shows a hemoglobin value of 11.2 g/dL, below the 12–16 g/dL reference range provided in the report.'}
        </p>
      </div>
    </div>
  )
}

function PreviewStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof FileText
  label: string
  value: string
  tone: 'primary' | 'danger' | 'success'
}) {
  const color =
    tone === 'danger' ? 'text-danger' : tone === 'success' ? 'text-success' : 'text-primary'
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <Icon className={`mb-2 size-4 ${color}`} />
      <p className="font-display text-xl font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
