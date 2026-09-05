import type { Metadata } from 'next'
import RegisterClient from './register-client'

export const metadata: Metadata = {
  title: 'Create Your Account',
  description:
    'Create your MedLens account to organize and review medical information with responsible AI assistance.',
}

export default function RegisterPage() {
  return <RegisterClient />
}