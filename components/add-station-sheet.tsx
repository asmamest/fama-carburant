'use client'

import { useState } from 'react'
import { MapPin, X } from 'lucide-react'
import type { FuelType, Station, StationStatus } from '@/lib/stations'
import { statusLabel } from '@/lib/stations'

const fuels: FuelType[] = ['Essence', 'Gasoil', 'Sans plomb']
const statuses: StationStatus[] = ['available', 'unavailable', 'uncertain']

export function AddStationSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (station: Station) => void }) {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState('36.8065')
  const [lng, setLng] = useState('10.1815')
  const [selectedStatuses, setSelectedStatuses] = useState<Record<FuelType, StationStatus>>({ Essence: 'available', Gasoil: 'uncertain', 'Sans plomb': 'uncertain' })
  const [error, setError] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedLat = Number(lat); const parsedLng = Number(lng)
    if (!name.trim() || !city.trim() || !address.trim() || !Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) { setError('Renseignez le nom, la ville, l’adresse et des coordonnées valides.'); return }
    const now = 'à l’instant'
    onAdd({ id: `community-${Date.now()}`, name: name.trim(), city: city.trim(), address: address.trim(), lat: parsedLat, lng: parsedLng, queue: 'Inconnue' as Station['queue'], confirmations: 1, confidence: 70, updatedAt: now, fuels: fuels.map((fuel) => ({ fuel, status: selectedStatuses[fuel], updatedAt: now })) })
  }

  return <div className="absolute inset-3 z-40 flex items-end justify-center md:items-center"><form onSubmit={submit} className="w-full max-w-lg rounded-[1.5rem] bg-white p-5 shadow-2xl md:p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Nouvelle station</p><h2 className="mt-1 text-xl font-bold text-slate-950">Ajouter un lieu absent</h2><p className="mt-1 text-sm text-slate-500">Partagez sa position et l’état constaté.</p></div><button type="button" onClick={onClose} aria-label="Fermer" className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5 text-xs font-bold text-slate-600 sm:col-span-2">Nom de la station<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Station Agil El Menzah" className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-950 outline-none focus:border-emerald-500" /></label><label className="grid gap-1.5 text-xs font-bold text-slate-600">Ville<input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ariana" className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-950 outline-none focus:border-emerald-500" /></label><label className="grid gap-1.5 text-xs font-bold text-slate-600">Adresse<input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Avenue Habib Bourguiba" className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-950 outline-none focus:border-emerald-500" /></label><label className="grid gap-1.5 text-xs font-bold text-slate-600"><span className="flex items-center gap-1"><MapPin size={13} />Latitude</span><input required value={lat} onChange={(e) => setLat(e.target.value)} inputMode="decimal" className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-950 outline-none focus:border-emerald-500" /></label><label className="grid gap-1.5 text-xs font-bold text-slate-600">Longitude<input required value={lng} onChange={(e) => setLng(e.target.value)} inputMode="decimal" className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-950 outline-none focus:border-emerald-500" /></label></div><div className="mt-5 grid gap-3">{fuels.map((fuel) => <div key={fuel} className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-700">{fuel}</span><select value={selectedStatuses[fuel]} onChange={(e) => setSelectedStatuses({ ...selectedStatuses, [fuel]: e.target.value as StationStatus })} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 outline-none">{statuses.map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></div>)}</div>{error && <p className="mt-4 text-sm font-semibold text-rose-600" role="alert">{error}</p>}<div className="mt-6 flex gap-2"><button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Annuler</button><button type="submit" className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700">Ajouter la station</button></div></form></div>
}
