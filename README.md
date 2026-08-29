# Fama Carburant

Fama Carburant est une carte collaborative mobile-first pour aider les conducteurs du Grand Tunis à trouver rapidement une station et à vérifier la disponibilité d’un carburant précis.

## Fonctionnalités principales

- Carte interactive OpenStreetMap avec stations issues de Neon PostgreSQL.
- Recherche par station ou ville, filtres par disponibilité et type de carburant.
- Fiche station avec état Essence, Gasoil et Sans plomb, fraîcheur et confirmations.
- Mise à jour communautaire des états via `station_reports`.
- Géolocalisation réelle du navigateur et lien d’itinéraire.
- Interface responsive pensée pour les petits écrans.

## Architecture

- **Next.js App Router** : pages, API routes et rendu de l’interface.
- **React Leaflet** : carte interactive et marqueurs.
- **SWR** : chargement et rafraîchissement client des stations.
- **Neon PostgreSQL + Drizzle** : source de vérité des stations et des signalements.
- `app/api/stations/route.ts` assemble les stations et le dernier état connu de chaque carburant.
- `app/api/reports/route.ts` enregistre les changements envoyés par la communauté.

Les stations ne sont pas hardcodées dans l’application : la table `stations` est la seule source de données affichée sur la carte. Les états récents sont calculés à partir de `station_reports`.

## Sources de données

### Sources officielles et publiques

- `catalog.data.gov.tn`, catalogue public/open data tunisien.
- Sites officiels des opérateurs et marques de stations-service, utilisés comme sources complémentaires.

### Données rapportées par les utilisateurs

Les informations de disponibilité, de rupture et d’incertitude peuvent être signalées par les utilisateurs et sont enregistrées dans `station_reports` avec leur timestamp. Elles complètent les sources officielles et publiques, mais doivent être distinguées de celles-ci : un état communautaire reflète une observation à un moment donné et peut devenir obsolète.

## Base de données

La table `stations` contient les informations permanentes de localisation et d’identité. La table `station_reports` conserve les changements d’état par station et carburant, avec `reported_at`; le dernier rapport pertinent est utilisé pour l’affichage.

Les variables Neon sont chargées par l’environnement du projet, notamment `DATABASE_URL`.

## Développement

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Contribuer

Les contributions doivent préserver Neon comme source de vérité, ne pas introduire de données mockées et garder l’expérience accessible sur mobile.

## Licence

Projet en cours de définition.

[Continuer avec v0](https://v0.app/chat/projects/prj_8nkQSwXZ8XdYmiND5U2t3z9ZqfrE)
