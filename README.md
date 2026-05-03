# CryptoNex — Fintech Analytics Terminal

![CryptoNex Dashboard](./public/favicon.svg)

CryptoNex is a high-performance, responsive cryptocurrency analytics dashboard built for the HackStreet April 2026 hackathon. It visualizes market data with Bloomberg-grade aesthetics using entirely mock datasets, simulating a live trading terminal environment without relying on external APIs.

## 🚀 Live Demo
*(Link your Vercel deployment here)*

## ✨ Key Features & Judging Criteria Met

| Requirement | Implementation |
|-------------|----------------|
| **Mock Datasets** | 100% static mock data (`src/data/`) with zero external API calls. |
| **Simulated Real-Time** | Custom `useLivePrices` hook uses a random-walk algorithm to simulate live volatility (±0.3% every 1.5s). |
| **Interactive Charts** | 6 distinct chart types including Area, Candlestick, Bar, and Donut using ApexCharts. |
| **Portfolio Tracking** | Tracks 6 assets showing allocation (donut chart), P&L, and 30-day historical performance. |
| **Filtering** | 1H/6H/24H/7D time ranges, market category pills, and dynamic coin selection. |
| **Advanced Visualization** | Hover tooltips (including custom HTML candlestick tips) and dynamic bullish/bearish color-coded signals. |
| **Additional Sections** | Full Watchlist, Order Book, Recent Transactions, and News Highlights components included. |
| **Fintech UI/UX** | Dark/Light theme engine, cascading skeleton loaders, smooth animations, and responsive mobile-first design. |

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Charts:** react-apexcharts
- **Icons:** lucide-react
- **Fonts:** Syne (Display), JetBrains Mono (Data), DM Sans (Body)

## 📦 Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📐 Architecture Highlights

- **`ThemeContext.jsx`:** Manages light/dark mode and forces chart re-renders when themes change to prevent artifacting.
- **`useCountUp.jsx`:** Custom hook for smooth number counting animations on statistics.
- **`useSkeletonLoader.jsx`:** Manages staggered, cascading loading states for a premium "system boot" feel.
- **`mockData.js`:** Contains data generation helpers (`generateRandomWalk`, `generateRandomOHLC`) to build realistic charts dynamically.

## 🏆 Hackathon Notes
This project was built to perfectly satisfy **Problem Statement 2**. It emphasizes a clean UI, data-heavy layout without clutter, and fluid interactions. The mobile view includes a fully functional hamburger menu and stacked responsive grids to ensure usability across all devices.
