# AI Interaction Log

This document captures how Generative AI assisted during development of this project. It focuses on the landing/entry experience (Discover page and header) and related scaffolding.

## AI Interaction Overview

- GitHub Copilot (in-editor): Inline code completion, refactors, and test scaffolding (React + TypeScript + Vite).
- ChatGPT (conversational): Brainstorming UX flows, drafting component APIs, and generating first-pass docs/tests.
- Claude (conversational): Reviewing architecture trade-offs, suggesting cleaner data models and state management boundaries.
- Google Gemini (notes/planning): Capturing feature plans and change logs; see `GEMINI.md` auto-generated summary of active tech and recent changes.

Roles these tools played:
- Brainstorming and ideation for the landing page structure (hero, trust panel, navigation, empty states).
- Code generation for React components and custom hooks.
- Test-first guidance for critical UI elements.
- Mock API design using MSW for fast iteration and reproducible tests.

## Prompting Details (selected 5)

1) Prompt
"Design a minimal landing experience for a local deals app. It should include a compact header, primary navigation, a hero section with search/filters, and a trust panel. Keep it mobile-first and accessible. Output React component structure in TypeScript."

Summary of AI response
- Proposed components: `HeaderBar`, `NavigationBar`, `TrustPanel`, `DiscoverPage` hero section.
- Suggested aria attributes, keyboard navigability, and mobile-first layout.
- Provided skeleton props and simple CSS organization.

Impact
- Directly informed `src/components/common/HeaderBar.tsx`, `NavigationBar.tsx`, `TrustPanel.tsx`, and the top section of `src/pages/DiscoverPage.tsx`.

---

2) Prompt
"Create a DealCard component API for grocery deals with pricing, discount, image, and CTA. Include TypeScript types and basic test cases with React Testing Library."

Summary of AI response
- Defined a Deal type with required fields and optional badges.
- Generated a `DealCard` with semantic HTML, price formatting, and a compact layout.
- Included tests for rendering title, price, and ‘Add to cart’ action.

Impact
- Seeded `src/components/discover/DealCard.tsx` and `src/components/discover/DealCard.test.tsx`.
- Encouraged consistent `types/index.ts` for shared data shapes.

---

3) Prompt
"Draft a FiltersPanel with categories, distance, and price range. Persist selections to localStorage and expose a composable hook."

Summary of AI response
- Proposed `useFilters` hook returning state, setters, and a `reset()` helper.
- Recommended `useLocalStorage` util for persistence and SSR-safety.
- Suggested unit tests for toggling categories and clearing filters.

Impact
- Implemented `src/hooks/useFilters.ts` and `src/hooks/useLocalStorage.ts`.
- Added `src/components/discover/FiltersPanel.tsx` and tests (`FiltersPanel.test.tsx`).

---

4) Prompt
"Provide an MSW setup for the deals API with handlers for /deals, /stores, and a single /deals/:id. Include a lightweight API client wrapper."

Summary of AI response
- Created mock handlers, browser/server setup, and a typed API layer.
- Demonstrated request/response shapes and error paths.

Impact
- Filled out `src/mocks/handlers.ts`, `src/mocks/browser.ts`, `src/mocks/server.ts` and `src/services/api.ts`.
- Enabled fast, deterministic tests for Discover and Deal Detail pages.

---

5) Prompt
"Write initial tests for the Discover landing page that verify: default filters applied, deal list renders, and empty state appears when no results."

Summary of AI response
- Provided test cases with `msw` overrides.
- Recommended accessibility queries and minimal act-wrapping.

Impact
- Guided `src/pages/DiscoverPage.test.tsx` and strengthened landing page reliability.

## Project Evolution (breakthroughs and refinements)

- Component contract clarity: Early prompts forced crisp interfaces for `DealCard`, `FiltersPanel`, and the landing hero, reducing rework later.
- State management boundaries: Moved transient UI state into `useFilters` while persisting cart/user in `CartContext` and `UserContext`. AI suggested persistence with `useLocalStorage` for a better first-run experience.
- Test-first mindset: Starting with tests for `DealCard`, `FiltersPanel`, and `DiscoverPage` created a safety net that made refactors (layout and styles) low-risk.
- Accessibility and semantics: AI nudged us toward aria labels, keyboard support, and color-contrast considerations in the landing view.
- Mock-driven development: MSW-backed API flow allowed building the landing and detail pages in parallel to real services, minimizing blockers.
- Type quality: Consolidated shared types in `src/types/index.ts` and tightened component props, catching regressions earlier.

## Notes and next steps

- Expand landing hero with saved searches and richer empty states (copy and illustrations).
- Add performance polish: image lazy-loading strategies and skeletons for the first paint.
- Extend tests to cover navigation flows from landing to detail and cart.
- Keep `GEMINI.md` in sync with significant feature shifts to preserve a high-level AI-generated changelog.
