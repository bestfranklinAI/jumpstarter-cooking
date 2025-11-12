# cooking — Deal Discovery and Purchase Flow (React + TypeScript + Vite)

cooking is a fast, mobile-first web app for discovering discounted food items nearby, adding them to a cart (across multiple stores), and checking out with clear pickup flows.

This repository implements the Discover landing experience, cart, and basic order views as specified in the feature plan and spec:

- specs: `specs/001-deal-discovery-flow/spec.md`, `plan.md`, `data-model.md`, `quickstart.md`
- tech: React + TypeScript + Vite + Vitest + MSW

Live site (GitHub Pages): https://bestfranklinAI.github.io/jumpstarter-cooking/

> Note: When deploying to GitHub Pages under a repository subpath, Vite must be configured with the correct `base`. See the Deployment section below.

## Features

- Map/list-based discovery of nearby deals (draft UI wired to mock data)
- Filters for categories, dietary needs, distance, and price range
- Sort by Distance, Price, Discount %, and Expiry
- Deal cards with image, pricing, discount, expiry, quantity, store, and distance
- Cart grouped by store; checkout button reflects number of pickups
- Orders view with separate active/past, and QR code screen (stub)
- Local persistence for key preferences and cart

Full functional requirements are captured in `specs/001-deal-discovery-flow/spec.md` (FR-001…FR-012) with measurable success criteria.

## Tech Stack

- React 18 + TypeScript
- Vite (dev/build)
- Vitest + React Testing Library (unit/integration tests)
- MSW (Mock Service Worker) for API simulation
- ESLint (TypeScript + React rules)

## Project Structure

```
src/
  components/
    common/            # HeaderBar, NavigationBar, TrustPanel
    discover/          # DealCard, FiltersPanel, ListView, MapView, StoreCard
    cart/
    orders/
  hooks/               # useFilters, useLocalStorage
  mocks/               # msw handlers, browser/server setup
  pages/               # DiscoverPage, DealDetailPage, CartPage, OrdersPage, QRCodePage
  services/            # api.ts
  state/               # CartContext, UserContext
  types/               # shared TypeScript types
public/
  mockServiceWorker.js # msw worker (auto-generated once)
specs/001-deal-discovery-flow/ # plan/spec/data-model/quickstart/contracts
```

## Getting Started

Requirements: Node 18+ (LTS recommended) and npm.

Install and run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Run tests:

```bash
npm test
```

MSW is wired for both browser and test environments. The worker file in `public/` is generated when needed; if it’s missing, run the app locally once or re-run the MSW init step.

## Deployment (GitHub Pages)

This project can be deployed as a static site to GitHub Pages. Because Pages serves the site from a subpath (`/jumpstarter-cooking/`), configure Vite’s `base` accordingly.

1) Update `vite.config.ts` to set the repository base path:

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/jumpstarter-cooking/', // <-- IMPORTANT for GitHub Pages
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

2) Commit and push to your default branch (e.g., `main`).

3) Add a GitHub Actions workflow to build and deploy to Pages (recommended). Create `.github/workflows/deploy.yml` with:

```yaml
name: Deploy Vite app to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

4) In your repository Settings → Pages, set “Build and deployment” to “GitHub Actions”.

After the first successful run, your site will be available at:

```
https://bestfranklinAI.github.io/jumpstarter-cooking/
```

Troubleshooting tips:
- If assets 404 on Pages, double-check the `base` value in `vite.config.ts`.
- If you use a custom domain, adjust `base` to match your domain root or subpath.

## Roadmap (from the spec)

- P1: First-time user discovers nearby deal and adds to cart (map → list → add)  
- P2: Advanced filtering and sorting across map and list  
- P2: Multi-store cart checkout and distinct pickup orders with QR codes  
- Edge cases: location denied, OOS/expired items, past pickup windows  

See `specs/001-deal-discovery-flow/spec.md` for acceptance scenarios and success criteria.

## License

This project is licensed under the terms of the license found in the `LICENSE` file.

## Acknowledgements

- Built with React, TypeScript, and Vite.
- Tests with Vitest and React Testing Library.
- Mock data layer via MSW for rapid development and reliable tests.
