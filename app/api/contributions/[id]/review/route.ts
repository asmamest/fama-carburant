import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { stationContributions, stations } from '@/lib/db/schema'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; const body = await request.json() as { decision?: string; rejectionReason?: string }
    if (body.decision !== 'approved' && body.decision !== 'rejected') return NextResponse.json({ error: 'Décision invalide.' }, { status: 400 })
    const [contribution] = await db.select().from(stationContributions).where(eq(stationContributions.id, id))
    if (!contribution || contribution.status !== 'pending') return NextResponse.json({ error: 'Contribution introuvable ou déjà traitée.' }, { status: 404 })
    if (body.decision === 'rejected') { const [updated] = await db.update(stationContributions).set({ status: 'rejected', rejectionReason: body.rejectionReason?.trim() || null, reviewedAt: new Date() }).where(eq(stationContributions.id, id)).returning(); return NextResponse.json(updated) }
    const [created] = await db.insert(stations).values({ id: `community-${contribution.id}`, name: contribution.name, city: contribution.city, address: contribution.address, lat: contribution.lat, lng: contribution.lng, queue: 'Moyenne', createdAt: new Date() }).returning()
    const [updated] = await db.update(stationContributions).set({ status: 'approved', reviewedAt: new Date() }).where(eq(stationContributions.id, id)).returning()
    return NextResponse.json({ contribution: updated, station: created })
  } catch (error) { console.error('[v0] contribution review failed', error); return NextResponse.json({ error: 'Impossible de traiter la contribution.' }, { status: 500 }) }
}
