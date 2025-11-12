# Quickstart: FreshCycle Deal Discovery

**Purpose**: To provide a simple guide for running the application and testing the core feature flow.

## Prerequisites

- Node.js and npm installed.
- A backend API that conforms to the `contracts/openapi.yml` specification running and accessible.
- A `.env` file in the root of the project with the API base URL:
  ```
  VITE_API_BASE_URL=http://localhost:3000/api
  ```

## Running the Application

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open the App**:
    Open your web browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Testing the Core User Flow (MVP)

This follows **User Story 1** from the feature specification.

1.  **Grant Location**:
    - When the app first loads, you should be prompted by your browser to allow location access. Click "Allow".
    - The map should center on your current location.

2.  **Discover a Deal**:
    - The map should display several pins representing deals.
    - Click on any pin. A "Store Card" should appear at the bottom of the screen with the store's name and deal count.

3.  **View Store Deals**:
    - On the "Store Card", click the "View Deals" button.
    - The view should switch to the "List View", showing a list of "Deal Cards" for that store only.

4.  **Add to Cart**:
    - Find a deal card in the list.
    - Click the `+` (Add to Cart) button on the card.
    - The item should be added to your cart. You can verify this by navigating to the "My Cart" tab using the bottom navigation bar.

5.  **Checkout**:
    - Navigate to the "My Cart" screen.
    - Verify the item you added is present.
    - Click the "Proceed to Pay" button.
    - After a successful payment simulation, you should be taken to the "My Orders" screen.

6.  **View QR Code**:
    - On the "My Orders" screen, you should see an "Active Order" card.
    - Click the "Show Pick-up Code" button.
    - A screen should appear displaying a large QR code, ready for scanning.
