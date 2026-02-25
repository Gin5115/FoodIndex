# FoodIndex: Architecture & Technical Vision
> *Academic Project Review & Implementation Guide*

This document provides a comprehensive, page-by-page breakdown of the **FoodIndex** platform. It details the technical features currently implemented for the MVP and outlines the strategic roadmap for future enhancements.

---

## 1. Landing Page (`/`)
**Objective:** Hook the user, explain the value proposition, and initiate the user journey with zero friction.

### Currently Implemented:
*   **Hero Section & Geolocation:** Features a clear call-to-action ("Find Deals Near Me") that integrates with the browser's Geolocation API to instantly capture the user's coordinates.
*   **Live Metrics / Value Prop:** Visual elements explaining the core concept (fight food waste, save money).
*   **Trending Deals (`TrendingGrid`):** Fetches randomly sampled or highly-viewed active products from the backend to showcase immediate value without requiring user login or commitment.

### Future Implementation:
*   **Personalized Feeds:** Use machine learning or basic collaborative filtering to show trending deals based on the user's past order history or declared dietary preferences.
*   **Live Impact Counter:** A real-time WebSocket counter showing "Total KGs of Food Saved Today" across the platform to emphasize the social impact instantly.

---

## 2. Authentication Flow (`/login`, `/signup`, `/business/register`)
**Objective:** Secure user access and differentiate between standard consumers and business entities.

### Currently Implemented:
*   **JWT Authentication:** Secure token-based access protecting private consumer and business routes.
*   **Polymorphic User Schema:** A unified `User` collection in MongoDB that handles both standard users and sellers (distinguished via an `isSeller` Boolean flag). This significantly reduces database complexity and auth duplication.
*   **Geolocated Seller Registration:** The `/business/register` page strictly requires businesses to provide their exact coordinates (via browser API) during signup. This is the foundational data required for the marketplace's spatial queries.

### Future Implementation:
*   **OAuth Integration:** Allow consumers to log in seamlessly using Google or Apple single sign-on.
*   **Email Verification & 2FA:** Require email confirmation for consumers and Two-Factor Authentication for businesses to ensure high platform security and trust.

---

## 3. The Marketplace (`/marketplace`)
**Objective:** The core discovery engine where users find hyperlocal food based on proximity and dynamic price.

### Currently Implemented:
*   **Geospatial Discovery Engine:** Utilizes MongoDB's advanced `$geoNear` aggregation pipeline to find sellers within a specific radius (e.g., 50km) of the user's detected location. This ensures users only see actionable, physically attainable deals.
*   **Proximity Calculation:** The backend calculates the exact distance (e.g., "1.2 km") and serves it to the frontend to display natively on the UI cards.
*   **Dynamic Pricing Badges:** Items display real-time prices calculated and updated constantly by our background algorithm.
*   **Context-Aware Header:** The search bar dynamically reacts to whether the user has provided location access (e.g., changing from a static search to a personalized "Search near you").

### Future Implementation:
*   **Interactive Map View:** Integrate Google Maps or Mapbox API to allow users to visually browse deals on a map interface instead of just a grid.
*   **Advanced Filtering:** Allow filtering by dietary restrictions (Vegan, Gluten-Free) or specific pickup time windows.

---

## 4. Product Details (`/product/:id`)
**Objective:** Provide full transparency into the deal urgency and item specifics to drive conversion.

### Currently Implemented:
*   **Dynamic Price Rundown:** Shows the original price, the current algorithmically reduced price, and a countdown timer (`expiryTime`) to create a sense of urgency.
*   **Live Stock Tracking:** Displays remaining inventory to utilize the psychological principle of scarcity.

### Future Implementation:
*   **Price Drop Notifications ("Watch" feature):** Users can click "Watch" to receive an email/push notification if the item drops below a certain price threshold.
*   **Quality Ratings & Reviews:** Allow users to rate the quality of the rescued food to maintain platform health and vendor accountability.

---

## 5. Cart & Checkout (`/cart`)
**Objective:** Smooth conversion from item selection to order placement.

### Currently Implemented:
*   **Context API State Management:** The entire cart is managed via React's Context API and synchronized with local browser storage (`localStorage`), ensuring users don't lose selected items upon page refresh.
*   **Order API:** A dedicated backend endpoint (`POST /api/orders`) securely records the order items, associates them with the authenticated user, and calculates the final total based on the dynamic prices at checkout.

### Future Implementation:
*   **Payment Gateway Integration:** Integrating Stripe or Razorpay API to process literal financial transactions and escrow funds.
*   **Concurrent Stock Locking:** Implementing database transactions to reserve stock the exact moment an item enters the checkout flow, preventing "overselling" high-demand items to multiple users.

---

## 6. Business Dashboard (`/dashboard/business`)
**Objective:** Provide intuitive tools for restaurants to confidently list surplus stock and track performance.

### Currently Implemented:
*   **Inventory Management:** Sellers can reliably Add, Update, and Delete products (`InventoryTable`, `AddItemModal`).
*   **Automated Scheduling:** When adding an item, sellers input a `pickupTime`, which the system automatically converts into a firm database `expiryTime` to feed the pricing algorithm.
*   **Basic Metrics:** View current active listings and orders placed against their active inventory.

### Future Implementation:
*   **Analytics Dashboards:** Visual graphs (using Recharts or Chart.js) showing revenue recovered over time, most popular surplus items, and average time-to-sell metrics.
*   **Pricing Strategy Modules:** Allow sellers to select pre-set strategies (e.g., "Aggressive Liquidation" vs. "High Margin Preservation") which tweak the background pricing algorithm's weightings.

---

## 7. Consumer Dashboard (`/dashboard/user`)
**Objective:** Account and engagement management for the buyer.

### Currently Implemented:
*   **Order History:** Users can view their past purchases and current pickup verification statuses.

### Future Implementation:
*   **Impact Metrics:** A dashboard showing the user's personal environmental impact (e.g., "You've saved 15kg of CO2 emissions by rescuing food!").
*   **Favorite Stores:** An ability to "Favorite" specific sellers and receive instant notifications when they post new surplus inventory.

---

*Document prepared for academic review of the FoodIndex Project lifecycle and technical architecture.*
