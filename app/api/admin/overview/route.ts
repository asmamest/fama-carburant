import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { pool } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const session = await requireAdmin(await headers())
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { rows } = await pool.query(`
    WITH latest AS (
      SELECT DISTINCT ON (station_id, fuel) station_id, fuel, status, reported_at
      FROM station_reports ORDER BY station_id, fuel, reported_at DESC
    ), station_state AS (
      SELECT s.id, s.name, s.city, s.address, s.lat, s.lng, s.queue,
        json_agg(json_build_object('fuel', f.fuel, 'status', l.status, 'reportedAt', l.reported_at)) AS fuels,
        MAX(l.reported_at) AS last_update,
        COUNT(l.station_id) FILTER (WHERE l.reported_at >= NOW() - INTERVAL '2 hours') AS recent_fuels,
        COUNT(l.station_id) AS reported_fuels
      FROM stations s CROSS JOIN (VALUES ('Essence'), ('Gasoil'), ('Sans plomb')) AS f(fuel)
      LEFT JOIN latest l ON l.station_id = s.id AND l.fuel = f.fuel
      GROUP BY s.id
    ), counts AS (
      SELECT COUNT(*)::int AS reports,
        COUNT(*) FILTER (WHERE status = 'available' AND reported_at >= NOW() - INTERVAL '2 hours')::int AS available,
        COUNT(*) FILTER (WHERE status = 'unavailable' AND reported_at >= NOW() - INTERVAL '2 hours')::int AS unavailable,
        COUNT(*) FILTER (WHERE status = 'uncertain' AND reported_at >= NOW() - INTERVAL '2 hours')::int AS uncertain,
        COUNT(*) FILTER (WHERE reported_at >= NOW() - INTERVAL '2 hours')::int AS recent_reports,
        COUNT(*) FILTER (WHERE reported_at < NOW() - INTERVAL '2 hours')::int AS historical_reports
      FROM station_reports
    ), contributions AS (
      SELECT COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
      FROM station_contributions
    ), actions AS (
      SELECT COUNT(*) FILTER (WHERE action = 'confirm')::int AS confirmations,
        COUNT(*) FILTER (WHERE action = 'report')::int AS community_reports
      FROM community_actions
    )
    SELECT (SELECT COUNT(*)::int FROM stations) AS total_stations,
      (SELECT COUNT(*)::int FROM stations WHERE queue <> 'closed') AS active_stations,
      (SELECT COUNT(*)::int FROM station_state WHERE reported_fuels > 0 AND recent_fuels = 0) AS stale_stations,
      (SELECT COUNT(*)::int FROM station_state WHERE reported_fuels = 0) AS no_data_stations,
      counts.*, contributions.*, actions.*,
      (SELECT json_agg(station_state ORDER BY last_update NULLS FIRST, city, name) FROM station_state) AS stations
    FROM counts, contributions, actions`)
  return NextResponse.json(rows[0] ?? {})
}
