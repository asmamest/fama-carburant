# Fama Carburant

**Find a station. Check availability. Report what you see.**

Fama Carburant is a collaborative map for the **Greater Tunis area** that helps drivers find nearby fuel stations and check the latest reported availability of **Essence, Gasoil and Sans Plomb**.

The application combines **official station data** with **time-stamped community reports**, while keeping official station data separate from user-submitted contributions.

> Fama Carburant aims to make fuel availability information easier to find, update, and verify.

---

## Features

* 🗺️ **Interactive map** of fuel stations in Greater Tunis
* ⛽ **Fuel availability** for Essence, Gasoil and Sans Plomb
* 🔎 **Search and filtering** by station, city, availability, and fuel type
* 🕐 **Freshness indicators** showing when availability was last reported
* 👥 **Community reports** for updating fuel availability
* 👍 **Community confirmations and reports** on observations
* 📍 **Browser geolocation** and route links
* ➕ **Community station submissions** with GPS coordinates and duplicate detection
* 📷 **Optional photo evidence** for submitted stations
* 🛡️ **Admin review workflow** for newly submitted stations
* 📱 **Mobile-first responsive interface**

---

## How It Works

Fama Carburant separates **official station data** from **community-generated information**.

```text
                    Official Data
                         │
                         ▼
                ┌─────────────────┐
                │    Stations     │
                └────────┬────────┘
                         │
                         ▼
                   Display on Map
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
       User Reports          Station Submissions
              │                     │
              ▼                     ▼
    station_reports        station_contributions
              │                     │
              ▼                     ▼
    Confirm / Report          Admin Review
              │                     │
              ▼                     ▼
    Availability Status      Approved / Rejected
```

### Fuel Availability Reports

Users can report the current availability of a fuel type at a station.

Each report is timestamped using `reported_at`, allowing the application to distinguish recent observations from older ones.

Community reports **do not modify the official station dataset**.

### Community Confirmations

Users can confirm or report an existing community observation.

These actions provide an additional signal about the reliability of a report while remaining separate from administrative validation.

### New Station Submissions

Users can submit a station that is not already present in the official dataset.

The application:

1. Gets the user's GPS position.
2. Checks GPS accuracy.
3. Searches for nearby existing stations.
4. Detects potential duplicates.
5. Creates the contribution with `pending` status.
6. Optionally stores a photo.
7. Sends the contribution through the admin review workflow.

A contribution is **never automatically promoted to an official station**.

---

## Data Model

The application uses separate data layers to avoid mixing trusted station records with user-generated information.

### `stations`

Contains the official station dataset displayed on the map.

### `station_reports`

Stores time-stamped community observations about fuel availability.

### `station_contributions`

Stores new stations submitted by users.

Contributions remain `pending` until reviewed by an administrator.

### `community_actions`

Stores community confirmations and reports while preventing duplicate actions from the same user.

The separation is intentional:

```text
Official station
      ≠
Community observation
      ≠
Community station submission
```

---

## Data Freshness

Fuel availability is time-sensitive.

For this reason, Fama Carburant stores the timestamp of each availability observation and exposes its freshness in the interface.

The application distinguishes between:

* **Available**
* **Unavailable**
* **Uncertain**
* **No recent observation**

When there is no recent community report, the interface applies the current product rule for displaying the station status. The absence of a recent report is kept distinct from a new community observation.

---

## Data Sources

The project currently relies on three types of data:

* **Tunisian open data** — [`catalog.data.gov.tn`](https://catalog.data.gov.tn/)
* **Official station/operator sources**
* **Community observations** submitted through Fama Carburant

Community observations are timestamped and remain distinct from the official station dataset.

---

## Tech Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Frontend      | Next.js, React, TypeScript   |
| Map           | React Leaflet, OpenStreetMap |
| Data Fetching | SWR                          |
| Database      | Neon PostgreSQL              |
| ORM           | Drizzle                      |
| File Storage  | Vercel Blob                  |
| Deployment    | Vercel                       |

---

## Architecture

```text
┌──────────────────────────────────────────────┐
│                  Web Client                  │
│             Next.js + React                  │
│                                              │
│   Map · Search · Filters · Station Details │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  API Layer                   │
│              Next.js API Routes              │
│                                              │
│ Stations · Reports · Contributions           │
└──────────────────────┬───────────────────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
┌─────────────────────┐  ┌────────────────────┐
│  Neon PostgreSQL    │  │    Vercel Blob     │
│                     │  │                    │
│ stations            │  │ Optional photos    │
│ station_reports     │  │                    │
│ contributions       │  │                    │
│ community_actions   │  │                    │
└─────────────────────┘  └────────────────────┘
```

---

## API Flows

The main application flows are organized around three API endpoints:

```text
/api/stations
        │
        └── Stations + latest availability

/api/reports
        │
        └── Fuel availability observations

/api/contributions
        │
        └── Community station submissions
```

The database remains the source of truth for persistent application data.

---

## Running Locally

### Requirements

* Node.js
* pnpm
* A Neon PostgreSQL database
* Required environment variables

### Installation

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file with the credentials required by the application.

Example:

```env
DATABASE_URL=...
BLOB_READ_WRITE_TOKEN=...
```

Do not commit secrets or production credentials to the repository.

---

## Contributing

**Fama Carburant is open to contributions.**

Whether you want to improve the map, add a feature, improve data coverage, fix a bug, or improve the reliability of community reports, contributions are welcome.

### Before contributing

Please keep the following principles:

* Do not introduce mock stations into production data.
* Keep official stations separate from community submissions.
* Preserve the `pending → approved / rejected` review workflow.
* Keep availability observations timestamped.
* Avoid duplicate community actions.
* Preserve the mobile-first experience.
* Do not bypass server-side validation.

### Getting Started

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application locally.
5. Open a pull request with a clear description of the change.

Ideas, bug reports, and improvements are also welcome through GitHub Issues.

---

## Project Status

Fama Carburant is an evolving project focused on **real-world, community-driven fuel availability data in Greater Tunis**.

The current system includes:

* Official station data
* Community fuel reports
* Report freshness
* Confirmations and reports
* Community station submissions
* Duplicate detection
* GPS validation
* Admin moderation
* Mobile-first map experience

Future improvements will focus on **data freshness, reliability, coverage, and community participation**.

---

## License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for the full license text.

---

## Author

**Asma Mestaysser**

Software Engineer · AI / Data / Software Engineering

* GitHub: [@asmamest](https://github.com/asmamest)
* Portfolio: [mestaysser-asma.vercel.app](https://mestaysser-asma.vercel.app/)

---

Made with love 😍, rabi ya7mi Tounes 🧡 
## Acknowledgements

* [OpenStreetMap](https://www.openstreetmap.org/) for map data
* [catalog.data.gov.tn](https://catalog.data.gov.tn/) for Tunisian open data
* The Fama Carburant community for contributing observations and improving data coverage
