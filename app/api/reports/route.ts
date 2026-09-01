import { NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { and, desc, eq, gte } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)
const stationReports = pgTable('station_reports', { id: uuid('id').defaultRandom().primaryKey(), stationId: text('station_id').notNull(), fuel: text('fuel').notNull(), status: text('status').notNull(), userId: text('user_id').notNull(), reportedAt: timestamp('reported_at', { withTimezone: true }).notNull().defaultNow() })
const cooldownMs = 15 * 60 * 1000
async function getUserId() { const jar = await cookies(); return jar.get('fama-user-id')?.value ?? crypto.randomUUID() }

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams; const stationId = params.get('stationId'); const fuel = params.get('fuel')
  if (!stationId) return NextResponse.json({ error: 'stationId requis' }, { status: 400 })
  if (fuel) { const userId = await getUserId(); const cutoff = new Date(Date.now() - cooldownMs); const [latest] = await db.select({ reportedAt: stationReports.reportedAt }).from(stationReports).where(and(eq(stationReports.stationId, stationId), eq(stationReports.fuel, fuel), eq(stationReports.userId, userId), gte(stationReports.reportedAt, cutoff))).orderBy(desc(stationReports.reportedAt)).limit(1); const remainingSeconds = latest ? Math.max(0, Math.ceil((latest.reportedAt.getTime() + cooldownMs - Date.now()) / 1000)) : 0; const response = NextResponse.json({ remainingSeconds }); response.cookies.set('fama-user-id', userId, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 31536000, path: '/' }); return response }
  const reports = await db.select().from(stationReports).where(eq(stationReports.stationId, stationId)).orderBy(desc(stationReports.reportedAt)).limit(30)
  return NextResponse.json(reports)
}

export async function POST(request: Request) {
  const body = await request.json(); const userId = await getUserId()
  if (!body.stationId || !body.fuel || !['available', 'unavailable', 'uncertain'].includes(body.status)) return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  const cutoff = new Date(Date.now() - cooldownMs)
  const [latest] = await db.select({ reportedAt: stationReports.reportedAt }).from(stationReports).where(and(eq(stationReports.stationId, body.stationId), eq(stationReports.fuel, body.fuel), eq(stationReports.userId, userId))).orderBy(desc(stationReports.reportedAt)).limit(1)
  if (latest && latest.reportedAt > cutoff) { const remainingSeconds = Math.ceil((latest.reportedAt.getTime() + cooldownMs - Date.now()) / 1000); return NextResponse.json({ error: 'cooldown', remainingSeconds }, { status: 429 }) }
  const [report] = await db.insert(stationReports).values({ stationId: body.stationId, fuel: body.fuel, status: body.status, userId }).returning()
  const response = NextResponse.json(report, { status: 201 }); response.cookies.set('fama-user-id', userId, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 31536000, path: '/' }); return response
}
