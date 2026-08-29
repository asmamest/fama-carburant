import { pgTable, text, timestamp, uuid, doublePrecision } from 'drizzle-orm/pg-core'

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
  reportedAt: timestamp('reported_at', { withTimezone: true }).notNull(),
})

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
