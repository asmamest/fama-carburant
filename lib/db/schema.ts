import { pgTable, text, timestamp, uuid, doublePrecision, uniqueIndex } from 'drizzle-orm/pg-core'

export const stations = pgTable('stations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  queue: text('queue').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const stationReports = pgTable('station_reports', {
  id: uuid('id').primaryKey(),
  stationId: text('station_id').notNull(),
  fuel: text('fuel').notNull(),
  status: text('status').notNull(),
  userId: text('user_id').notNull(),
  reportedAt: timestamp('reported_at', { withTimezone: true }).notNull(),
})

export const communityActions = pgTable('community_actions', {
  id: uuid('id').defaultRandom().primaryKey(),
  contributionId: uuid('contribution_id').notNull(),
  userId: text('user_id').notNull(),
  action: text('action').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  contributionUserUnique: uniqueIndex('community_actions_contribution_user_unique').on(table.contributionId, table.userId),
}))

export const stationContributions = pgTable('station_contributions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  gpsAccuracy: doublePrecision('gps_accuracy').notNull(),
  photoPath: text('photo_path'),
  status: text('status').notNull(),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
})
