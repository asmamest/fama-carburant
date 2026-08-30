'use client'

import { useEffect } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { FuelType, Station, StationStatus } from '@/lib/stations'
import { statusLabel } from '@/lib/stations'

const fuels: FuelType[] = ['Essence', 'Gasoil', 'Sans plomb']
const colors: Record<StationStatus, string> = { available: '#10b981', unavailable: '#f43f5e', uncertain: '#f59e0b', no_recent_information: '#94a3b8' }

function MapViewport({ located, selected, userLocation }: { located: boolean; selected: Station | null; userLocation: [number, number] | null }) {
  const map = useMap()
  useEffect(() => { if (located && userLocation) map.flyTo(userLocation, 14, { duration: 0.8 }) }, [located, map, userLocation])
  useEffect(() => { if (selected) map.flyTo([selected.lat, selected.lng], 13, { duration: 0.6 }) }, [selected, map])
  return null
}

function markerIcon(station: Station, selected: boolean, fuelFilter?: FuelType) {
  const segments = fuels.map((fuel) => {
    const item = station.fuels.find((entry) => entry.fuel === fuel)
    return `<i style="background:${colors[item?.status ?? 'no_recent_information']}"></i>`
  }).join('')
  const active = fuelFilter ? station.fuels.find((item) => item.fuel === fuelFilter)?.status ?? 'no_recent_information' : null
  return L.divIcon({ className: 'fuel-marker-wrapper', html: `<div class="fuel-marker ${selected ? 'is-selected' : ''} ${fuelFilter ? 'is-filtered' : ''}" style="--marker-color:${active ? colors[active] : '#10b981'}">${fuelFilter ? `<span></span>` : segments}</div>`, iconSize: [36, 44], iconAnchor: [18, 38], popupAnchor: [0, -36] })
}

export function InteractiveMap({ stations, selected, located, onSelect, userLocation, fuelFilter }: { stations: Station[]; selected: Station | null; located: boolean; onSelect: (station: Station) => void; userLocation: [number, number] | null; fuelFilter?: FuelType }) {
  return <MapContainer center={[36.8065, 10.1815]} zoom={11} zoomControl={false} className="absolute inset-0 z-0" aria-label="Carte interactive des stations-service du Grand Tunis">
    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MapViewport located={located} selected={selected} userLocation={userLocation} />
    {userLocation && <CircleMarker center={userLocation} radius={7} fill color="#3b82f6" weight={3} opacity={0.8} fillOpacity={0.3} />}
    {stations.map((station) => <Marker key={station.id} position={[station.lat, station.lng]} icon={markerIcon(station, selected?.id === station.id, fuelFilter)} eventHandlers={{ click: () => onSelect(station) }}><Popup><strong>{station.name}</strong><br />{fuelFilter ? statusLabel[station.fuels.find((item) => item.fuel === fuelFilter)?.status ?? 'no_recent_information'] : 'États carburant disponibles'}</Popup></Marker>)}
  </MapContainer>
}
