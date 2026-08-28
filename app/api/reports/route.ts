import { NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { desc, eq } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)
const stationReports = pgTable('station_reports', { id: uuid('id').defaultRandom().primaryKey(), stationId: text('station_id').notNull(), fuel: text('fuel').notNull(), status: text('status').notNull(), reportedAt: timestamp('reported_at', { withTimezone: true }).notNull().defaultNow() })

export async function GET(request: Request) {
  const stationId = new URL(request.url).searchParams.get('stationId')
  if (!stationId) return NextResponse.json({ error: 'stationId requis' }, { status: 400 })
  const reports = await db.select().from(stationReports).where(eq(stationReports.stationId, stationId)).orderBy(desc(stationReports.reportedAt)).limit(30)
  return NextResponse.json(reports)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.stationId || !body.fuel || !['available', 'unavailable', 'uncertain'].includes(body.status)) return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  const [report] = await db.insert(stationReports).values({ stationId: body.stationId, fuel: body.fuel, status: body.status }).returning()
  return NextResponse.json(report, { status: 201 })
}
