import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { AdminOperationsDashboard } from '@/components/admin-operations-dashboard'

export default async function AdminPage() {
  const session = await requireAdmin(await headers())
  if (!session) redirect('/admin/login')
  return <AdminOperationsDashboard />
}
