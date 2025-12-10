# Merry360 MVP - Fully Functional Travel Platform

## 🚀 Live Demo Credentials

### Test Accounts

**Regular User Account:**
- Email: `demo@merry360.com`
- Password: `password123`
- Access: Browse accommodations, tours, transport, make bookings

**Admin Account:**
- Email: `admin@merry360.com`
- Password: `admin123`
- Access: Admin dashboard with platform management

**Vendor Account:**
- Email: `vendor@merry360.com`
- Password: `vendor123`
- Access: Vendor portal for property management

## 📋 Features Implemented

### ✅ Complete MVP Functionality

#### 1. **Authentication System**
- User registration with email validation
- Login with role-based routing (user/admin/vendor)
- Token-based authentication
- Password validation
- Social login UI (Google, Facebook)

#### 2. **Accommodation Management**
- Browse 6 properties with real data
- Search and filter by:
  - Price range
  - Property type (Hotel, Resort, Lodge, etc.)
  - Rating
  - Amenities
  - Eco-friendly options
- Sort by price and rating
- View detailed property pages
- Image galleries
- Reviews and ratings
- Google Maps integration

#### 3. **Tours & Activities**
- 6 tour packages across categories:
  - Nature (Gorilla Trekking)
  - Adventure (Lake Kivu, Canopy Walk)
  - Culture (Kigali City Tour)
  - Wildlife (Akagera Safari)
  - Historical (King's Palace)
- Full itineraries
- Group size limits
- Inclusions list

#### 4. **Transport Services**
- Airport transfers
- Car rentals
- Private transfers
- Intercity bus
- Taxi & shuttle services

#### 5. **Booking System**
- Complete checkout flow
- Guest information validation
- Payment method selection:
  - Credit/Debit card
  - Mobile money
- Special requests
- Booking confirmation
- Payment processing (mock)

#### 6. **User Dashboard**
- View profile
- Manage bookings
- Loyalty points
- Wishlist management
- Trip cart

#### 7. **Multi-language Support**
- English (EN)
- Kinyarwanda (RW)
- French (FR)
- Chinese (ZH)
- Swahili (SW)

#### 8. **Multi-currency Support**
- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- CNY - Chinese Yuan
- RWF - Rwandan Franc

#### 9. **Dark Mode**
- Full dark mode support
- Consistent styling across all pages
- Smooth transitions

#### 10. **Mobile Responsive**
- Fully responsive design
- Touch-optimized
- 2-column grid layouts on mobile
- Glassy transparent navbar
- Bottom-positioned AI advisor

#### 11. **Additional Features**
- AI Concierge chatbot
- Cross-category suggestions
- Toast notifications
- Form validation
- Loading states
- Error handling
- Wishlist/favorites
- Trip cart with multi-item booking

## 🏗️ Technical Architecture

### Frontend Stack
- **Vue 3** - Composition API
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool

### Mock Backend
- Comprehensive mock API (`src/services/mockApi.js`)
- Mock data service (`src/services/mockData.js`)
- Simulates real API responses with delays
- Token-based authentication
- CRUD operations for bookings

### Data Flow
```
Component → API Service → Mock API → Mock Data
                    ↓
            State Management (Pinia)
                    ↓
            UI Updates (Vue Reactivity)
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/ - AI Concierge chatbot
│   ├── common/ - Reusable UI components
│   └── layout/ - Layout wrappers
├── composables/ - Vue composables (validation, translation, toast)
├── router/ - Vue Router configuration
├── services/
│   ├── api.js - API service interface
│   ├── mockApi.js - Mock backend implementation
│   └── mockData.js - Sample data
├── stores/ - Pinia stores
│   ├── app.js - App settings
│   ├── currency.js - Currency management
│   ├── language.js - Language management
│   └── userStore.js - User data & authentication
├── utils/ - Utility functions
└── views/ - Page components
    ├── accommodation/ - Property pages
    ├── admin/ - Admin dashboard
    ├── cart/ - Trip cart
    ├── dashboard/ - User dashboard
    ├── home/ - Homepage
    ├── onboarding/ - Login/Signup
    ├── tours/ - Tour pages
    ├── transport/ - Transport pages
    └── vendor/ - Vendor portal
```

## 🎯 User Flows

### 1. New User Journey
1. Visit homepage
2. Browse accommodations/tours/transport
3. Click "Sign up"
4. Fill registration form
5. Auto-login and redirect to homepage
6. Browse and add items to cart
7. Proceed to checkout
8. Complete booking with payment

### 2. Booking Flow
1. Browse accommodations
2. Filter by preferences
3. View property details
4. Select dates and guests
5. Add to cart or book directly
6. Fill guest information
7. Select payment method
8. Confirm booking
9. Receive booking confirmation

### 3. Admin Flow
1. Login with admin credentials
2. Access admin dashboard
3. View platform stats
4. Manage properties
5. View bookings
6. Manage users

## 🎨 Design System

### Colors
- **Brand**: Red (#EF4444)
- **Accent**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#DC2626)

### Dark Mode
- Background: gray-900
- Cards: gray-800
- Text: white/gray-200
- Borders: gray-600/700

### Typography
- Headings: Bold, Brand color
- Body: Regular, gray-600
- Links: Brand color with hover

## 🔐 Security (MVP Level)

- Client-side form validation
- Email format validation
- Password strength requirements
- Phone number format validation
- Token storage in localStorage
- Protected routes (planned)

## 📱 Responsive Breakpoints

- Mobile: < 768px (2 columns)
- Tablet: 768px - 1024px
- Desktop: > 1024px (3-4 columns)

## 🌐 API Endpoints (Mock)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset

### Accommodations
- `GET /accommodations` - List all properties
- `GET /accommodations/:id` - Property details
- `GET /accommodations/search` - Search properties

### Tours
- `GET /tours` - List all tours
- `GET /tours/:id` - Tour details
- `POST /tours/:id/book` - Book a tour

### Transport
- `GET /transport/routes` - Available routes
- `GET /transport/vehicles` - Available vehicles
- `POST /transport/book` - Book transport

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/my-bookings` - User's bookings
- `DELETE /bookings/:id` - Cancel booking

### Payments
- `POST /payments/intent` - Create payment intent
- `POST /payments/:id/confirm` - Confirm payment

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_API=true
```

### Mock API
By default, the app uses the mock API. To switch to a real backend:
1. Set `VITE_USE_MOCK_API=false` in `.env`
2. Update `VITE_API_BASE_URL` to your backend URL

## 📊 Sample Data

### Accommodations
- 6 properties across Rwanda
- Hotels, Resorts, Lodges, Apartments
- Price range: $95 - $320/night
- Ratings: 4.5 - 4.9 stars

### Tours
- 6 tour packages
- Categories: Nature, Adventure, Culture, Wildlife
- Duration: 1-3 days
- Price range: $80 - $1,500

### Transport
- 5 transport options
- Types: Taxi, Shuttle, Car Rental, Private Transfer, Bus
- Price range: $10 - $120

## 🐛 Known Limitations (MVP)

1. **Mock Backend**
   - Data is not persisted (refreshes reset data)
   - No actual payment processing
   - No real-time updates

2. **Authentication**
   - No password reset email
   - No email verification
   - No OAuth integration (UI only)

3. **Booking**
   - No booking history persistence
   - No PDF confirmations
   - No calendar integration

4. **Search**
   - Basic search implementation
   - No advanced filters
   - No location-based search

## 🎯 Next Steps for Production

### Phase 1: Backend Integration
- [ ] Connect to real API
- [ ] Implement authentication middleware
- [ ] Add data persistence
- [ ] Set up database

### Phase 2: Enhanced Features
- [ ] Real payment gateway (Stripe, PayPal)
- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Real-time availability
- [ ] Calendar integration

### Phase 3: Performance
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] PWA support
- [ ] Caching strategy

### Phase 4: Admin Features
- [ ] Property management CRUD
- [ ] User management
- [ ] Analytics dashboard
- [ ] Revenue reports
- [ ] Booking management

### Phase 5: Vendor Features
- [ ] Property listing creation
- [ ] Calendar management
- [ ] Pricing management
- [ ] Guest communication
- [ ] Revenue tracking

## 📝 Testing

### Manual Testing Checklist
- [x] User registration
- [x] User login
- [x] Browse accommodations
- [x] Filter accommodations
- [x] View property details
- [x] Add to cart
- [x] Checkout flow
- [x] Payment validation
- [x] Dark mode toggle
- [x] Language switcher
- [x] Currency converter
- [x] Mobile responsive
- [x] Admin dashboard access
- [x] Vendor dashboard access

## 🤝 Contributing

This is an MVP version. For production:
1. Replace mock API with real backend
2. Add comprehensive testing
3. Implement security best practices
4. Add error tracking (Sentry)
5. Set up CI/CD pipeline

## 📄 License

All rights reserved - Merry360 © 2025

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Contact: support@merry360.com

---

**Built with ❤️ by the Merry360 Team**
