# Merry360 - Complete Travel & Hospitality Platform

![Merry360 Logo](https://via.placeholder.com/150x150?text=Merry360)

A fully functional MVP travel booking platform for Rwanda, featuring accommodations, tours, transport services, and more.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Merry-360-x/merry_360_frontend.git

# Navigate to project directory
cd merry_360_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔑 Test Credentials

### Regular User
- **Email:** support@merry360x.com
- **Password:** password123

### Admin
- **Email:** admin@merry360.com
- **Password:** admin123

### Vendor
- **Email:** vendor@merry360.com
- **Password:** vendor123

## ✨ Features

- **🏨 Accommodations** - Browse and book hotels, resorts, lodges
- **🗺️ Tours & Activities** - Gorilla trekking, safaris, cultural tours
- **🚗 Transport Services** - Airport transfers, car rentals, shuttles
- **💳 Booking System** - Complete checkout with payment integration
- **👤 User Dashboard** - Manage bookings, profile, wishlist
- **🌐 Multi-language** - EN, FR, RW, ZH, SW
- **💱 Multi-currency** - USD, EUR, GBP, CNY, RWF
- **🌙 Dark Mode** - Full dark mode support
- **📱 Mobile Responsive** - Optimized for all devices
- **🤖 AI Concierge** - Interactive chat assistant

## 🛠️ Tech Stack

- **Frontend:** Vue 3 (Composition API)
- **Routing:** Vue Router
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Mock Backend:** Custom mock API service

## 📁 Project Structure

```
src/
├── components/     # Reusable Vue components
├── views/          # Page components
├── stores/         # Pinia state management
├── services/       # API services & mock data
├── router/         # Vue Router configuration
├── composables/    # Vue composables
└── utils/          # Utility functions
```

## 🎯 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📖 Documentation

For detailed documentation, see [MVP_DOCUMENTATION.md](./MVP_DOCUMENTATION.md)

## 🔌 Integrations & Environment Variables

This project supports multiple backend options for production-ready services. Choose one:

### Option 1: Supabase (Recommended)
Supabase provides a fully managed PostgreSQL backend with real-time, authentication, and storage.

Set in `.env`:
- `VITE_USE_SUPABASE=true`
- `VITE_SUPABASE_URL=` (your Supabase project URL)
- `VITE_SUPABASE_ANON_KEY=` (your public anon key)

### Option 2: Firebase
For Firebase Auth/Firestore/Storage integration:
- `VITE_USE_FIREBASE=true`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Option 3: Mock API (Default)
For local development without external dependencies:
- `VITE_USE_MOCK_API=true` (runs in-memory mock backend)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

All rights reserved - Merry360 © 2025

## 📧 Contact

- **Email:** support@merry360.com
- **Website:** https://merry360.com
- **GitHub:** https://github.com/Merry-360-x

---

**Built with ❤️ in Rwanda**
