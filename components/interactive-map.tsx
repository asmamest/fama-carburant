'use client'

import { useEffect } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Station } from '@/lib/stations'
import { stationStatus, statusLabel } from '@/lib/stations'

function MapViewport({ located, selected, userLocation }: { located: boolean; selected: Station | null; userLocation: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (located && userLocation) map.flyTo(userLocation, 14, { duration: 0.8 })
  }, [located, map])
  useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], 13, { duration: 0.6 })
  }, [selected, map])
  return null
}

function markerIcon(station: Station, selected: boolean) {
  const status = stationStatus(station)
  const color = status === 'available' ? '#10b981' : status === 'unavailable' ? '#f43f5e' : '#f59e0b'
  return L.divIcon({
    className: 'fuel-marker-wrapper',
    html: `<div class="fuel-marker ${selected ? 'is-selected' : ''}" style="--marker-color:${color}"><span></span></div>`,
    iconSize: [34, 42],
    iconAnchor: [17, 36],
    popupAnchor: [0, -34],
  })
}

export function InteractiveMap({ stations, selected, located, onSelect, userLocation }: { stations: Station[]; selected: Station | null; located: boolean; onSelect: (station: Station) => void; userLocation: [number, number] | null }) {
  return (
    <MapContainer center={[36.8065, 10.1815]} zoom={11} zoomControl={false} className="absolute inset-0 z-0" aria-label="Carte interactive des stations-service du Grand Tunis">
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapViewport located={located} selected={selected} userLocation={userLocation} />
      {userLocation && <CircleMarker center={userLocation} radius={7} fill color="#3b82f6" weight={3} opacity={0.8} fillOpacity={0.3} />}
      {stations.map((station) => (
        <Marker key={station.id} position={[station.lat, station.lng]} icon={markerIcon(station, selected?.id === station.id)} eventHandlers={{ click: () => onSelect(station) }}>
          <Popup><strong>{station.name}</strong><br />{statusLabel[stationStatus(station)]}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
