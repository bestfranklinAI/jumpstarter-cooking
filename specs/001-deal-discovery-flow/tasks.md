# Tasks: FreshCycle Deal Discovery and Purchase Flow

**Input**: Design documents from `/specs/001-deal-discovery-flow/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The constitution requires tests, so they are included below.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths are based on the single project structure defined in `plan.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [x] T001 [P] Create initial directory structure in `src/` (components, hooks, pages, services, state, types) as defined in `plan.md`.
- [x] T002 [P] Install additional dependencies for map integration (`react-leaflet`, `leaflet`) and API calls (`axios`).
- [x] T003 [P] Configure Vitest and React Testing Library in `vite.config.ts` if not already present.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Define all core data types in `src/types/index.ts` based on `data-model.md` (User, Store, Item, Deal, Cart, Order).
- [x] T005 [P] Create a mock API service worker using `msw` to return sample data based on `openapi.yml`. Configure it in `src/mocks/`.
- [x] T006 Create the API service layer in `src/services/api.ts` with functions for `getDeals`, `getOrders`, and `createOrder`.
- [x] T007 [P] Set up global state management for Cart and User using React Context API. Create `src/state/CartContext.tsx` and `src/state/UserContext.tsx`.
- [x] T008 Implement the `useLocalStorage` custom hook in `src/hooks/useLocalStorage.ts` for persisting state.
- [x] T009 Create the main application layout in `src/App.tsx` with a persistent Header and bottom Navigation Bar structure.
- [x] T010 [P] Create placeholder pages for Discover, My Cart, My Orders, and Alerts in `src/pages/`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - First-Time User Discovers a Nearby Deal (Priority: P1) 🎯 MVP

**Goal**: A new user can open the app, see a map of deals, and add an item to their cart.
**Independent Test**: A new user can install the app and add an item to the cart without using filters or search.

### Tests for User Story 1 ⚠️
> **NOTE: Write these tests FIRST, ensure they FAIL before implementation.**

- [x] T011 [P] [US1] Unit test for the `DealCard` component in `src/components/discover/DealCard.test.tsx`.
- [x] T012 [P] [US1] Integration test for the map view in `src/pages/DiscoverPage.test.tsx` to ensure deals are rendered from the mock API.

### Implementation for User Story 1

- [x] T013 [P] [US1] Implement the `HeaderBar` component in `src/components/common/HeaderBar.tsx`.
- [x] T014 [P] [US1] Implement the `NavigationBar` component in `src/components/common/NavigationBar.tsx`.
- [x] T015 [P] [US1] Implement the `DealCard` component in `src/components/discover/DealCard.tsx`.
- [x] T016 [P] [US1] Implement the `StoreCard` component in `src/components/discover/StoreCard.tsx`.
- [x] T017 [US1] Implement the map view using `react-leaflet` in `src/components/discover/MapView.tsx`.
- [x] T018 [US1] Implement the list view in `src/components/discover/ListView.tsx`.
- [x] T019 [US1] Implement the main `DiscoverPage` in `src/pages/DiscoverPage.tsx`, integrating the map and list views with a toggle.
- [x] T020 [US1] Implement the logic to fetch and display deals on the `DiscoverPage` using the service from `T006`.
- [x] T021 [US1] Implement the "Add to Cart" functionality within `CartContext.tsx` and connect it to the `DealCard` component.

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - User Filters for Specific Dietary Needs (Priority: P2)

**Goal**: A user can filter deals based on various preferences like category and diet.
**Independent Test**: Applying filters correctly updates the deals shown on the map and list views.

### Tests for User Story 2 ⚠️
- [x] T022 [P] [US2] Unit test for the `FiltersPanel` component in `src/components/discover/FiltersPanel.test.tsx`.

### Implementation for User Story 2

- [x] T023 [P] [US2] Implement the `FiltersPanel` component in `src/components/discover/FiltersPanel.tsx` with all filter options from the spec.
- [x] T024 [US2] Create a `useFilters` custom hook in `src/hooks/useFilters.ts` to manage filter state.
- [x] T025 [US2] Integrate the `FiltersPanel` and `useFilters` hook with the `DiscoverPage` to refetch deals when filters are applied.

**Checkpoint**: User Stories 1 AND 2 should both work.

---

## Phase 5: User Story 3 - User Checks Out with Items from Multiple Stores (Priority: P2)

**Goal**: A user can view a cart with items grouped by store and complete the purchase flow to receive a QR code.
**Independent Test**: A user can add items from two different stores, check out, and view two distinct order QR codes.

### Tests for User Story 3 ⚠️
- [x] T026 [P] [US3] Unit test for the cart grouping logic in `src/pages/CartPage.test.tsx`.
- [x] T027 [P] [US3] Integration test for the checkout flow, mocking the API call, in `src/pages/CartPage.test.tsx`.

### Implementation for User Story 3

- [x] T028 [P] [US3] Implement the `CartPage` in `src/pages/CartPage.tsx`, ensuring items are grouped by store.
- [x] T029 [P] [US3] Implement the `OrdersPage` in `src/pages/OrdersPage.tsx` to display active and past orders.
- [x] T030 [P] [US3] Implement the `QRCodePage` in `src/pages/QRCodePage.tsx` to display the pickup code.
- [x] T031 [US3] Implement the checkout logic in `CartContext.tsx` to call the `createOrder` API service.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [x] T032 [P] Implement responsive design for all components to ensure usability on various screen sizes.
- [x] T033 [P] Add loading skeletons/spinners for all data-fetching states.
- [x] T034 [P] Implement user-friendly error handling for API failures (e.g., toast notifications).
- [x] T035 Review and add accessibility (a11y) attributes to all interactive components.
- [x] T036 Validate the entire flow against `quickstart.md`.

---

## Dependencies & Execution Order

- **Foundational (Phase 2)** must be completed before any User Story phase.
- User Stories can be implemented in parallel after Phase 2 is complete.
- Within each story, tests should be written first, followed by implementation.

## Implementation Strategy

The suggested approach is **Incremental Delivery**:
1. Complete Phase 1 & 2.
2. Complete Phase 3 (User Story 1) to deliver the MVP.
3. Complete Phase 4 (User Story 2).
4. Complete Phase 5 (User Story 3).
5. Finalize with Phase 6 (Polish).
