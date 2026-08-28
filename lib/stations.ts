export type FuelType = 'Essence' | 'Gasoil' | 'Sans plomb'
export type StationStatus = 'available' | 'unavailable' | 'uncertain'

export type FuelAvailability = {
  fuel: FuelType
  status: StationStatus
  updatedAt: string
}

export type Station = {
  id: string
  name: string
  city: string
  address: string
  lat: number
  lng: number
  queue: 'Faible' | 'Moyenne' | 'Forte'
  confirmations: number
  confidence: number
  updatedAt: string
  fuels: FuelAvailability[]
}

export const stations: Station[] = [
  { id: 'lac-1', name: 'Shell Les Berges du Lac', city: 'Les Berges du Lac', address: 'Avenue du Lac Léman', lat: 36.84, lng: 10.25, queue: 'Faible', confirmations: 8, confidence: 92, updatedAt: 'il y a 4 min', fuels: [{ fuel: 'Essence', status: 'available', updatedAt: 'il y a 4 min' }, { fuel: 'Gasoil', status: 'available', updatedAt: 'il y a 4 min' }, { fuel: 'Sans plomb', status: 'uncertain', updatedAt: 'il y a 18 min' }] },
  { id: 'centre-1', name: 'TotalEnergies Centre Urbain', city: 'Centre Urbain Nord', address: 'Avenue de la Ligue Arabe', lat: 36.835, lng: 10.185, queue: 'Moyenne', confirmations: 14, confidence: 84, updatedAt: 'il y a 9 min', fuels: [{ fuel: 'Essence', status: 'available', updatedAt: 'il y a 9 min' }, { fuel: 'Gasoil', status: 'unavailable', updatedAt: 'il y a 9 min' }, { fuel: 'Sans plomb', status: 'available', updatedAt: 'il y a 9 min' }] },
  { id: 'marsa-1', name: 'Oilibya La Marsa', city: 'La Marsa', address: 'Route de Gammarth', lat: 36.878, lng: 10.325, queue: 'Forte', confirmations: 5, confidence: 61, updatedAt: 'il y a 26 min', fuels: [{ fuel: 'Essence', status: 'uncertain', updatedAt: 'il y a 26 min' }, { fuel: 'Gasoil', status: 'available', updatedAt: 'il y a 26 min' }, { fuel: 'Sans plomb', status: 'unavailable', updatedAt: 'il y a 26 min' }] },
  { id: 'ariana-1', name: 'Agil Ariana', city: 'Ariana', address: 'Avenue Habib Bourguiba', lat: 36.866, lng: 10.195, queue: 'Faible', confirmations: 21, confidence: 96, updatedAt: 'il y a 2 min', fuels: [{ fuel: 'Essence', status: 'available', updatedAt: 'il y a 2 min' }, { fuel: 'Gasoil', status: 'available', updatedAt: 'il y a 2 min' }, { fuel: 'Sans plomb', status: 'available', updatedAt: 'il y a 2 min' }] },
  { id: 'benarous-1', name: 'Star Oil Ben Arous', city: 'Ben Arous', address: 'Route de Sousse Km 4', lat: 36.75, lng: 10.23, queue: 'Moyenne', confirmations: 11, confidence: 78, updatedAt: 'il y a 12 min', fuels: [{ fuel: 'Essence', status: 'available', updatedAt: 'il y a 12 min' }, { fuel: 'Gasoil', status: 'uncertain', updatedAt: 'il y a 12 min' }, { fuel: 'Sans plomb', status: 'available', updatedAt: 'il y a 12 min' }] },
]

export const statusLabel: Record<StationStatus, string> = { available: 'Disponible', unavailable: 'Rupture', uncertain: 'Incertain' }
export const statusColor: Record<StationStatus, string> = { available: 'bg-emerald-500', unavailable: 'bg-rose-500', uncertain: 'bg-amber-400' }
export const statusText: Record<StationStatus, string> = { available: 'text-emerald-700', unavailable: 'text-rose-700', uncertain: 'text-amber-700' }

export function stationStatus(station: Station): StationStatus {
  const statuses = station.fuels.map((fuel) => fuel.status)
  if (statuses.includes('available')) return 'available'
  if (statuses.every((status) => status === 'unavailable')) return 'unavailable'
  return 'uncertain'
}

export function distanceFromTunis(station: Station) {
  const distance = Math.sqrt(Math.pow(station.lat - 36.8065, 2) + Math.pow(station.lng - 10.1815, 2)) * 90
  return `${distance.toFixed(1)} km`
}

export const demoStats = { total: stations.length, available: stations.filter((station) => stationStatus(station) === 'available').length, uncertain: stations.filter((station) => stationStatus(station) === 'uncertain').length, reports: 127 }

// Future Neon boundary: replace these demo reads with Drizzle queries once the live schema is confirmed.
export async function getStations() { return stations }
export async function getStation(id: string) { return stations.find((station) => station.id === id) }
export type Report = { stationId: string; fuel: FuelType; status: StationStatus; queue: Station['queue']; note?: string }
export async function createReport(report: Report) { return { ...report, createdAt: new Date().toISOString() } }
export async function getStats() { return demoStats }

export function mapsUrl(station: Station) { return `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}` }
