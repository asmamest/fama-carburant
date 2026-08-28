import Link from 'next/link'

export default function PrivacyPage() {
  return <main className="min-h-screen bg-slate-950 px-5 py-8 text-white"><div className="mx-auto max-w-2xl"><Link href="/" className="text-sm font-semibold text-emerald-400">← Retour à la carte</Link><h1 className="mt-16 text-4xl font-bold tracking-tight">Confidentialité</h1><p className="mt-6 leading-8 text-slate-300">Fama Carburant privilégie une expérience simple et respectueuse. La géolocalisation n’est utilisée que lorsque vous cliquez sur « Me localiser » et reste dans votre navigateur pour ce MVP.</p><p className="mt-4 leading-8 text-slate-400">Les contributions communautaires seront stockées de manière sécurisée lors du branchement de la base Neon. Aucune donnée personnelle superflue n’est demandée pour consulter la carte.</p></div></main>
}
