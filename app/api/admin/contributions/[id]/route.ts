import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { stationContributions, stations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(await headers())
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json() as { action?: string; reason?: string }
  if (!['approve', 'reject'].includes(body.action ?? '')) return NextResponse.json({ error: 'Action invalide.' }, { status: 400 })
  const result = await db.transaction(async (tx) => {
    const [contribution] = await tx.select().from(stationContributions).where(eq(stationContributions.id, id)).limit(1)
    if (!contribution) return { error: 'Contribution introuvable.', status: 404 }
    if (contribution.status !== 'pending') return { contribution, status: 200 }
    if (body.action === 'reject') {
      const [updated] = await tx.update(stationContributions).set({ status: 'rejected', rejectionReason: body.reason?.trim() || 'Contribution rejetée par un administrateur.', reviewedAt: new Date() }).where(eq(stationContributions.id, id)).returning()
      return { contribution: updated, status: 200 }
    }
    const stationId = `community-${contribution.id}`
    const [station] = await tx.insert(stations).values({ id: stationId, name: contribution.name, city: contribution.city, address: contribution.address, lat: contribution.lat, lng: contribution.lng, queue: 'open', createdAt: new Date() }).onConflictDoNothing().returning()
    const [updated] = await tx.update(stationContributions).set({ status: 'approved', reviewedAt: new Date(), rejectionReason: null }).where(eq(stationContributions.id, id)).returning()
    return { contribution: updated, station: station ?? { id: stationId }, status: 200 }
  })
  return NextResponse.json(result, { status: result.status })
}
