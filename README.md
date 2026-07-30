# Incurv ERP

A modern, premium SaaS ERP UI demo built with React, TypeScript, and Vite.

## Screens

- **Bulk Entry: Purchase Requisition** — `/`
- **New Purchase Order** — `/newPurchase`

Both screens share a common app shell (sidebar navigation + top bar) and follow
the same design language: clean enterprise surfaces, inline validation,
editable line-item tables, and a sticky summary sidebar with approval workflow
previews.

## Tech stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- Client-side routing via [react-router-dom](https://reactrouter.com/)
- State managed with React's `useReducer` (no external state library)
- Plain CSS (`src/styles.css`) — no CSS framework

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints in the terminal (defaults to
`http://localhost:5173`).

## Project structure

```
src/
  catalog.ts            mock item catalog + formatting helpers
  types.ts              shared types for the Requisition flow
  state.ts              Requisition reducer + derived totals
  layout/
    AppLayout.tsx        shared sidebar/top bar shell (react-router Outlet)
  components/            shared UI (Sidebar, TopBar, Stepper, etc.)
  pages/
    BulkRequisitionPage.tsx   Purchase Requisition screen
    NewPurchaseOrderPage.tsx  New Purchase Order screen
  po/
    types.ts, state.ts       Purchase Order data model + reducer
    components/               PO-specific UI (header, vendor, lines, summary)
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
