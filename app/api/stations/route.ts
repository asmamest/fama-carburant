import { NextResponse } from 'next/server'
import { desc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { stationReports, stations } from '@/lib/db/schema'
import type { FuelType, Station, StationStatus } from '@/lib/stations'

const fuels: FuelType[] = ['Essence', 'Gasoil', 'Sans plomb']

export async function GET() {
  try {
    const [rows, reports] = await Promise.all([
      db.select().from(stations),
      db.select().from(stationReports).where(sql`${stationReports.reportedAt} >= now() - interval '2 hours'`).orderBy(desc(stationReports.reportedAt)),
    ])
    const latest = new Map<string, typeof reports[number]>()
    for (const report of reports) {
      const key = `${report.stationId}:${report.fuel}`
      if (!latest.has(key)) latest.set(key, report)
    }
    const data: Station[] = rows.map((row) => {
      const rowFuels = fuels.map((fuel) => {
        const report = latest.get(`${row.id}:${fuel}`)
        const status: StationStatus = report?.status === 'available' || report?.status === 'unavailable' || report?.status === 'uncertain' ? report.status : 'available'
        const updatedAt = report?.reportedAt?.toISOString() ?? row.createdAt.toISOString()
        return { fuel, status, updatedAt }
      })
      const reportsForStation = reports.filter((report) => report.stationId === row.id)
      const available = rowFuels.filter((item) => item.status === 'available').length
      const unavailable = rowFuels.filter((item) => item.status === 'unavailable').length
      return { id: row.id, name: row.name, city: row.city, address: row.address, lat: row.lat, lng: row.lng, queue: (['Faible', 'Moyenne', 'Forte'].includes(row.queue) ? row.queue : 'Moyenne') as Station['queue'], confirmations: reportsForStation.length, confidence: reportsForStation.length ? Math.min(99, 60 + reportsForStation.length * 5) : 0, updatedAt: rowFuels.map((item) => item.updatedAt).sort().at(-1) ?? row.createdAt.toISOString(), fuels: rowFuels, available, unavailable }
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('[v0] Failed to load stations', error)
    return NextResponse.json({ error: 'Impossible de charger les stations.' }, { status: 500 })
  }
}
