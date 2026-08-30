export type FuelType = 'Essence' | 'Gasoil' | 'Sans plomb'
export type StationStatus = 'available' | 'unavailable' | 'uncertain' | 'no_recent_information'

export type FuelAvailability = { fuel: FuelType; status: StationStatus; updatedAt: string }
export type Station = { id: string; name: string; city: string; address: string; lat: number; lng: number; queue: 'Faible' | 'Moyenne' | 'Forte'; confirmations: number; confidence: number; updatedAt: string; fuels: FuelAvailability[] }

export const statusLabel: Record<StationStatus, string> = { available: 'Disponible', unavailable: 'Rupture', uncertain: 'Incertain', no_recent_information: 'Aucune info récente' }
export const statusColor: Record<StationStatus, string> = { available: 'bg-emerald-500', unavailable: 'bg-rose-500', uncertain: 'bg-amber-400', no_recent_information: 'bg-slate-400' }
export const statusText: Record<StationStatus, string> = { available: 'text-emerald-700', unavailable: 'text-rose-700', uncertain: 'text-amber-700', no_recent_information: 'text-slate-500' }

export function stationStatus(station: Station): StationStatus {
  if (station.fuels.length === 0) return 'available'
  const statuses = station.fuels.map((fuel) => fuel.status)
  if (statuses.includes('available')) return 'available'
  if (statuses.length > 0 && statuses.every((status) => status === 'unavailable')) return 'unavailable'
  return 'uncertain'
}

export function distanceFromTunis(station: Station) {
  const distance = Math.sqrt(Math.pow(station.lat - 36.8065, 2) + Math.pow(station.lng - 10.1815, 2)) * 90
  return `${distance.toFixed(1)} km`
}

export function mapsUrl(station: Station) { return `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}` }
