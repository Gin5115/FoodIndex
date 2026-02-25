# FoodIndex

FoodIndex is a hyper-local food rescue marketplace. It connects consumers with nearby restaurants, cafes, and bakeries to purchase surplus food at dynamically discounted prices. Our goal is to fight food waste while providing affordable meals.

## Features

- **Dynamic Pricing Engine:** Calculates real-time discounts based on four factors: time to expiry, remaining stock pressure, live demand (views), and overall urgency.
- **Geospatial Discovery:** Utilizes GPS and MongoDB geospatial queries to show consumers actionable deals within a specifically calculated distance radius.
- **Dual-role Authentication:** A streamlined system allowing regular users and business sellers to exist under a unified schema, authenticated via JWT.
- **Business Dashboard:** A management interface for sellers to add inventory, set pickup times, and track orders.
- **Consumer Marketplace:** An intuitive grid interface with trending deals, real-time price updates, and distance badges.

## Tech Stack

This project is built using the MERN stack.

### Frontend
- **React (Vite)**: For fast, component-based UI development.
- **Tailwind CSS**: For utility-first styling and responsive design.
- **React Context API**: For global state management (Authentication, Cart, User Location).

### Backend
- **Node.js & Express**: Handling API requests, business logic, and background jobs.
- **MongoDB & Mongoose**: Flexible document storage, heavily utilizing `$geoNear` aggregation for location-based search.
- **Node-Cron**: Background service running the dynamic pricing updates at set intervals.

## Prerequisites

Before running this project, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gin5115/FSD_MACSE640.git
   cd FSA
   ```

2. **Frontend Setup:**
   ```bash
   # Install dependencies
   npm install
   
   # Start the Vite development server
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   # Navigate to the server directory
   cd server
   
   # Install dependencies
   npm install
   
   # Create a .env file and configure necessary variables
   # Example:
   # PORT=5000
   # MONGO_URI=mongodb://localhost:27017/foodindex
   # JWT_SECRET=your_super_secret_key
   
   # Seed the database (Optional: Populates Chennai seller locations and dummy products)
   npm run seed
   
   # Start the Express server
   npm run dev
   ```

## API Structure

The backend provides RESTful endpoints organized under `/api`:
- `/api/auth`: User and Seller registration, login, and profile fetching.
- `/api/products`: Full CRUD for business listings, plus geospatial searches and trending logic.
- `/api/orders`: Securely handles checkout and order retrieval for both consumers and sellers.

## Background Jobs
The `pricingEngine.js` cron job handles real-time decay and price drops. It operates entirely independently of the request-response cycle, recalculating values every 5 minutes based on active product rules.
