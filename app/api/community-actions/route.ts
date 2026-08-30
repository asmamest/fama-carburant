import { NextResponse } from 'next/server'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { communityActions } from '@/lib/db/schema'

export async function GET(request: Request) {
  const contributionId = new URL(request.url).searchParams.get('contributionId')
  if (!contributionId) return NextResponse.json({ error: 'contributionId requis' }, { status: 400 })
  const [counts] = await db.select({ confirmationsCount: sql<number>`count(*) filter (where ${communityActions.action} = 'confirm')`, reportsCount: sql<number>`count(*) filter (where ${communityActions.action} = 'report')` }).from(communityActions).where(eq(communityActions.contributionId, contributionId))
  return NextResponse.json({ confirmationsCount: Number(counts?.confirmationsCount ?? 0), reportsCount: Number(counts?.reportsCount ?? 0) })
}

export async function POST(request: Request) {
  const body = await request.json() as { contributionId?: string; userId?: string; action?: string }
  if (!body.contributionId || !body.userId || !['confirm', 'report'].includes(body.action ?? '')) return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  try {
    await db.insert(communityActions).values({ contributionId: body.contributionId, userId: body.userId, action: body.action! })
  } catch {
    return NextResponse.json({ alreadyVoted: true, error: 'already_voted' }, { status: 409 })
  }
  const [counts] = await db.select({ confirmationsCount: sql<number>`count(*) filter (where ${communityActions.action} = 'confirm')`, reportsCount: sql<number>`count(*) filter (where ${communityActions.action} = 'report')` }).from(communityActions).where(eq(communityActions.contributionId, body.contributionId))
  return NextResponse.json({ success: true, confirmationsCount: Number(counts?.confirmationsCount ?? 0), reportsCount: Number(counts?.reportsCount ?? 0) })
}
