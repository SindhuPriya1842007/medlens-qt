'use client'

import { Salad } from 'lucide-react'
import { AiLabel } from '@/components/medlens-badges'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NUTRITION_TOPICS } from '@/lib/demo-data'

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Nutrition Education</h1>
        <p className="mt-1 text-sm text-muted-foreground">General educational information based on available context.</p>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <AiLabel />
        <span className="text-xs text-muted-foreground">Educational information — not medical advice</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {NUTRITION_TOPICS.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Salad className="size-4" />
                </div>
                <CardTitle className="text-sm">{topic.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{topic.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {topic.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1 size-1 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        This is general educational information. It is not a diagnosis or treatment recommendation. Consult a qualified professional.
      </p>
    </div>
  )
}
