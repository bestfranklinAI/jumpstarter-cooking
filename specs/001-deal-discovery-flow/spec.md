# Feature Specification: FreshCycle Deal Discovery and Purchase Flow

**Feature Branch**: `001-deal-discovery-flow`  
**Created**: 2025-11-12  
**Status**: Draft  
**Input**: User description: "This design prioritizes speed, clarity, and trust, ensuring the user can find what they want and check out in minimal steps..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time User Discovers a Nearby Deal (Priority: P1)

A new user opens the app for the first time, grants location permissions, and immediately sees a map of their surroundings with several deals pinned. They tap on a deal pin for a nearby supermarket, view the store's available deals, and add a discounted salad to their cart directly from the list.

**Why this priority**: This is the core "happy path" for user acquisition and demonstrates the app's primary value proposition instantly.

**Independent Test**: Can be tested by a new user from app install to adding the first item to the cart without using any advanced filters or search.

**Acceptance Scenarios**:

1. **Given** a user has just installed the app, **When** they open it for the first time, **Then** they are prompted to grant location permissions.
2. **Given** the user has granted location permissions, **When** the main screen loads, **Then** a map is displayed centered on their current location with deal pins visible.
3. **Given** the user taps on a deal pin, **When** the store card appears, **Then** it shows the store name, distance, and number of deals.
4. **Given** the user taps "View Deals" on the store card, **When** the list view appears, **Then** it is filtered to show deals only from that store.
5. **Given** the user is on the list view, **When** they tap the "+" icon on a deal card, **Then** the item is added to their cart.

---

### User Story 2 - User Filters for Specific Dietary Needs (Priority: P2)

A returning user is looking for a gluten-free lunch. They open the app, tap the "Filters" button, select the "Gluten-Free" and "Ready-to-Eat" categories, and apply the filters. The map and list views update to show only matching items. They sort the list by "Discount %" to find the best deal and add it to their cart.

**Why this priority**: Filtering is the primary mechanism for preference-based discovery, catering to users with specific needs and increasing conversion.

**Independent Test**: Can be tested by applying various filters and verifying that both the map and list views update correctly to reflect the selected criteria.

**Acceptance Scenarios**:

1. **Given** the user is on the "Discover" screen, **When** they tap the "Filters" button, **Then** a panel with filtering options is displayed.
2. **Given** the user selects the "Gluten-Free" and "Ready-to-Eat" checkboxes and applies filters, **When** the "Discover" screen reloads, **Then** only items matching these criteria are shown on the map and in the list.
3. **Given** the user is on the list view, **When** they sort by "Discount % (Highest First)", **Then** the list re-orders to show the items with the largest percentage discount at the top.

---

### User Story 3 - User Checks Out with Items from Multiple Stores (Priority: P2)

A user has added items from two different supermarkets to their cart. They navigate to the "My Cart" screen and see their items grouped by store. They review the subtotals for each pickup and the grand total, then proceed to payment. After paying, they navigate to "My Orders" and see two separate active orders, one for each store.

**Why this priority**: This scenario handles a common and complex use case, ensuring the checkout and order management process is clear and trustworthy for multi-location pickups.

**Independent Test**: Can be tested by adding items from at least two different stores to the cart and completing the checkout process.

**Acceptance Scenarios**:

1. **Given** a user has items from "Store A" and "Store B" in their cart, **When** they view the "My Cart" screen, **Then** the items are displayed in two separate groups, one for each store.
2. **Given** the cart contains items from two stores, **When** the user looks at the checkout button, **Then** it reads "Proceed to Pay (2 Pick-ups)".
3. **Given** the user has successfully paid, **When** they view the "My Orders" screen, **Then** they see two "Active Order" cards, one for each store pickup.
4. **Given** the user taps "Show Pick-up Code" on an active order, **Then** a screen with a unique QR code, order number, and item list is displayed.

---

### Edge Cases

- What happens if location services are denied or unavailable? The app should default to a manually entered location.
- What happens when an item's quantity reaches zero while a user is viewing it? The "Add to Cart" button should become disabled.
- What happens if a user tries to check out and an item in their cart has just expired or gone out of stock? The user should be notified in the cart before payment, and the item should be removed.
- How does the system handle pick-up windows that have passed? The deal should no longer be displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST request location permission on the first launch.
- **FR-002**: System MUST display deals on a map view, clustered when zoomed out.
- **FR-003**: System MUST display deals in a scrollable list view, sortable by Distance, Price, Discount %, and Expiry.
- **FR-004**: Users MUST be able to filter deals by Categories, Store, Dietary needs, and Price range.
- **FR-005**: The cart MUST group items by their pickup store location.
- **FR-006**: The checkout button MUST indicate the number of separate store pick-ups.
- **FR-007**: After payment, the system MUST generate a unique QR code for each store-specific order.
- **FR-008**: The "My Orders" screen MUST separate active (ready for pickup) and past orders.
- **FR-009**: Deal cards MUST display an image, item name, new price, original price, discount, expiry info, quantity, store name, and distance.
- **FR-010**: The system MUST provide a mechanism for users to set a manual location for discovery.
- **FR-011**: The cart summary MUST display a subtotal, a total, and a line item for a service fee calculated as a percentage of the total order value (e.g., 2%).
- **FR-012**: The "Alerts" navigation item MUST be included as a basic feature for notifying users about specific items.

### Key Entities

- **Store**: Represents a supermarket partner. Attributes: Name, Address, Location (GPS coordinates).
- **Deal**: Represents a discounted item for sale. Attributes: Item details, Original Price, Discounted Price, Expiry Date/Time, Quantity available. Belongs to one Store.
- **Item**: Represents the product itself. Attributes: Name, Description, Image(s), Allergens/Ingredients.
- **Cart**: A temporary collection of deals a user intends to purchase. Grouped by Store.
- **Order**: A confirmed purchase of one or more deals from a single store. Attributes: Order Number, Status (e.g., "Paid," "Completed"), QR Code, associated User and Store.
- **User**: Represents the app user. Attributes: Profile information, Payment Methods, Order History.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can successfully find and add a deal to their cart within 60 seconds of first opening the app.
- **SC-002**: The checkout process for a cart with items from two different stores can be completed in under 90 seconds.
- **SC-003**: 95% of filtered searches (map or list) must return results in under 2 seconds.
- **SC-004**: The "Add to Cart" action from the list view must provide visual feedback in under 500ms.
- **SC-005**: The rate of cart abandonment after reaching the checkout screen should be less than 20%.