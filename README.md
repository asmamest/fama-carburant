# Fama Carburant

Fama Carburant est une carte collaborative mobile-first pour aider les conducteurs du Grand Tunis à trouver rapidement une station et à connaître la disponibilité de l’Essence, du Gasoil et du Sans plomb.

## Fonctionnalités

- Carte interactive OpenStreetMap avec stations officielles issues de Neon PostgreSQL.
- Recherche par station ou ville, filtres par disponibilité et type de carburant.
- Fiche station avec les trois carburants, leur statut, la fraîcheur du dernier signalement et les confirmations.
- Tous les carburants affichés sans signalement récent sont considérés comme disponibles par défaut dans l’interface.
- Mise à jour communautaire des disponibilités via `station_reports`.
- Ajout de stations par la communauté avec géolocalisation, précision GPS, détection de doublons et statut `pending`.
- Photo facultative stockée dans un Blob privé.
- Validation communautaire advisory avec confirmations et signalements, sans promotion automatique vers les stations officielles.
- Workflow de revue admin avec états `pending`, `approved` et `rejected`.
- Géolocalisation réelle du navigateur et lien d’itinéraire.
- Interface responsive pensée pour mobile et desktop.

## Architecture

- **Next.js App Router** : pages, API routes et interface.
- **React Leaflet** : carte et interactions avec les marqueurs.
- **SWR** : chargement et rafraîchissement client.
- **Neon PostgreSQL + Drizzle** : tables officielles, rapports et contributions communautaires.
- **Vercel Blob privé** : stockage des photos facultatives de contributions.
- `app/api/stations/route.ts` assemble les stations et leurs derniers états.
- `app/api/reports/route.ts` enregistre les observations de disponibilité.
- `app/api/contributions/route.ts` crée les contributions en attente et vérifie les doublons proches.
- `community_actions` protège les confirmations et signalements contre les doublons par utilisateur.

## Données et confiance

La table `stations` reste la source officielle affichée sur la carte. Les nouvelles contributions sont isolées dans `station_contributions` et restent `pending` jusqu’à une revue admin. Les actions communautaires fournissent des compteurs de confirmation et de signalement, mais ne remplacent jamais l’approbation administrative.

Les disponibilités sont conservées dans `station_reports` avec `reported_at`. L’interface affiche les statuts disponibles, indisponibles ou incertains; en l’absence de rapport récent, le carburant est affiché comme disponible par défaut selon la règle produit actuelle.

## Sources

- `catalog.data.gov.tn`, catalogue public/open data tunisien.
- Sites officiels des opérateurs et marques de stations-service.
- Observations communautaires datées dans `station_reports`.

## Développement

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Contribution

Les contributions doivent préserver Neon comme source de vérité, ne pas introduire de données mockées et garder l’expérience accessible sur mobile.
