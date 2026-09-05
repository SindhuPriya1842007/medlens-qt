import type { Metadata } from 'next'
import DemoClient from './demo-client'

export const metadata: Metadata = {
  title: 'Try the MedLens Demo',
  description:
    'Explore the MedLens demo to see how medical information can be organized into a clear, connected record with responsible AI assistance.',
}

export default function DemoPage() {
  return <DemoClient />
}