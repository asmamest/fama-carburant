import { NextRequest, NextResponse } from 'next/server'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { stationContributions, stations } from '@/lib/db/schema'

const MAX_ACCURACY = 150
const MAX_DISTANCE = 0.02

function validText(value: unknown) { return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 180 }

export async function GET() {
  try {
    const rows = await db.select({ id: stationContributions.id, name: stationContributions.name, city: stationContributions.city, status: stationContributions.status, createdAt: stationContributions.createdAt, rejectionReason: stationContributions.rejectionReason }).from(stationContributions)
    return NextResponse.json(rows)
  } catch (error) { console.error('[v0] contributions GET failed', error); return NextResponse.json({ error: 'Impossible de charger les contributions.' }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>
    const lat = Number(body.lat); const lng = Number(body.lng); const accuracy = Number(body.gpsAccuracy)
    if (!validText(body.name) || !validText(body.city) || !validText(body.address) || !Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(accuracy) || accuracy <= 0 || accuracy > MAX_ACCURACY) return NextResponse.json({ error: 'Informations invalides ou précision GPS insuffisante.' }, { status: 400 })
    const nearby = await db.select({ id: stations.id, name: stations.name, lat: stations.lat, lng: stations.lng }).from(stations).where(sql`abs(${stations.lat} - ${lat}) < ${MAX_DISTANCE} AND abs(${stations.lng} - ${lng}) < ${MAX_DISTANCE}`)
    if (nearby.length > 0 && body.confirmDuplicate !== true) return NextResponse.json({ duplicate: true, nearby }, { status: 409 })
    const [created] = await db.insert(stationContributions).values({ name: String(body.name).trim(), city: String(body.city).trim(), address: String(body.address).trim(), lat, lng, gpsAccuracy: accuracy, photoPath: typeof body.photoPath === 'string' ? body.photoPath : null, status: 'pending', rejectionReason: null, createdAt: new Date(), reviewedAt: null }).returning({ id: stationContributions.id, status: stationContributions.status, createdAt: stationContributions.createdAt })
    return NextResponse.json(created, { status: 201 })
  } catch (error) { console.error('[v0] contribution POST failed', error); return NextResponse.json({ error: 'Impossible d’enregistrer cette contribution.' }, { status: 500 }) }
}
