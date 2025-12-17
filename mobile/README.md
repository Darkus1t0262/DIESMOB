# EcoCombustible Regulador Tablet

Expo + React Native (TypeScript) prototype for a regulator dashboard tablet app. Runs fully offline with mock data.

## Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo` optional)

## Setup
```bash
cd mobile
npm install
npm start # or npx expo start
```

The app name/slug is `eco-combustible-regulador-tablet`.

## Available scripts
- `npm start` – run Metro bundler
- `npm test` – Jest unit tests
- `npm run lint` – ESLint check
- `npm run format` – Prettier format

## Testing
```bash
npm test
```

## Mock API failure rate
`src/services/api.ts` exposes `api.setFailureRate(rate: number)` to tweak simulated errors and latency.

## Features
- Login with local session persistence via AsyncStorage
- Dashboard with KPIs and module shortcuts
- Stations list + detail, compliance badges, search and filters
- Citizen complaints form with validation, GPS/photo optional (graceful permission handling) and history list
- Remote audits list + detail with approve/reject actions
- Map with Ecuador focus, station markers colored by compliance, and simulated consumption intensity circles
- Reports with filters, summaries, export simulations (PDF/Excel/CSV) and recent reports list
- Responsive drawer (permanent on ≥900px) for tablets

## Screenshots
_Add screenshots of key screens here when available._
