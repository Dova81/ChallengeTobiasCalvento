# React Challenge: Product Reviews

Full-stack mini challenge with a NestJS backend and a React + Vite + TypeScript frontend. Users can browse products and add reviews that persist in-memory on the server.

## Stack
- Backend: NestJS 11, TypeScript, Jest
- Frontend: React 19, Vite 7, TypeScript, Context API
- Tooling: ESLint, Prettier

## Quick start
1. Prerequisites: Node.js 18+ and npm.
2. Start the backend:
   ```bash
   cd backend
   npm install
   npm run start:dev
   # server runs on http://localhost:3000 by default (set PORT to override)
   ```
3. Start the frontend (in a new terminal):
   ```bash
   cd frontEnd
   npm install
   # optional: set API base (defaults to http://localhost:3000)
   # PowerShell example: $env:VITE_API_BASE_URL="http://localhost:3000"
   npm run dev
   ```
4. Open the printed Vite URL (usually http://localhost:5173) and submit reviews.

## Environment variables
- Backend: `PORT` (optional)
- Frontend: `VITE_API_BASE_URL` (optional, defaults to `http://localhost:3000`)

## API
- `GET /products` — returns the product list with existing reviews.
- `POST /products/:id/reviews` — body `{ reviewer: string, rating: 1-5, comment: string }`; validates presence and rating range.

## Scripts
Backend (from `backend/`):
- `npm run start:dev` — run with hot reload
- `npm run test` / `npm run test:e2e` — unit and e2e tests
- `npm run lint` — lint TypeScript

Frontend (from `frontEnd/`):
- `npm run dev` — dev server with HMR
- `npm run build` — type-check and bundle
- `npm run preview` — preview production build
- `npm run lint` — lint sources

## Project structure
```
backend/    NestJS API (products and reviews)
frontEnd/   React client (product list and review form)
```

## Notes
- Backend data is in-memory; restart resets reviews.
- CORS is enabled on the API so the Vite dev server can call it.
