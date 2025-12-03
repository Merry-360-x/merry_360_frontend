import { createRouter, createWebHistory } from 'vue-router'

// Onboarding
import SplashScreen from '../views/onboarding/SplashScreen.vue'
import WelcomeSlider from '../views/onboarding/WelcomeSlider.vue'
import Login from '../views/onboarding/Login.vue'
import Signup from '../views/onboarding/Signup.vue'
import ForgotPassword from '../views/onboarding/ForgotPassword.vue'

// Home
import Home from '../views/home/Home.vue'
import PropertyHome from '../views/home/PropertyHome.vue'

// About
import About from '../views/about/About.vue'

// Accommodation
import AccommodationList from '../views/accommodation/AccommodationList.vue'
import AccommodationDetail from '../views/accommodation/AccommodationDetail.vue'
import AccommodationCheckout from '../views/accommodation/AccommodationCheckout.vue'

// Transport
import TransportList from '../views/transport/TransportList.vue'
import TransportBooking from '../views/transport/TransportBooking.vue'
import TransportServices from '../views/transport/TransportServices.vue'

// Tours
import ToursList from '../views/tours/ToursList.vue'
import TourDetail from '../views/tours/TourDetail.vue'
import TourBooking from '../views/tours/TourBooking.vue'
import ToursPage from '../views/tours/ToursPage.vue'

// Services
import ServicesPage from '../views/services/ServicesPage.vue'

// Host
import BecomeHost from '../views/host/BecomeHost.vue'

// Dashboard
import UserDashboard from '../views/dashboard/UserDashboard.vue'
import MyTrips from '../views/dashboard/MyTrips.vue'

// Cart
import TripCart from '../views/cart/TripCart.vue'

// Wishlist
import Wishlist from '../views/wishlist/Wishlist.vue'

// Stories
import ShareStories from '../views/stories/ShareStories.vue'

// Admin
import AdminDashboard from '../views/admin/AdminDashboard.vue'

// Vendor
import VendorDashboard from '../views/vendor/VendorDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/splash',
    name: 'splash',
    component: SplashScreen
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomeSlider
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: '/stories',
    name: 'stories',
    component: ShareStories
  },
  {
    path: '/home-old',
    name: 'home-old',
    component: Home
  },
  {
    path: '/accommodations',
    name: 'accommodations',
    component: AccommodationList
  },
  {
    path: '/accommodation/:id',
    name: 'accommodation-detail',
    component: AccommodationDetail
  },
  {
    path: '/accommodation/:id/checkout',
    name: 'accommodation-checkout',
    component: AccommodationCheckout
  },
  {
    path: '/transport',
    name: 'transport',
    component: TransportServices
  },
  {
    path: '/transport/list',
    name: 'transport-list',
    component: TransportList
  },
  {
    path: '/transport/booking',
    name: 'transport-booking',
    component: TransportBooking
  },
  {
    path: '/tours',
    name: 'tours',
    component: ToursPage
  },
  {
    path: '/tours/list',
    name: 'tours-list',
    component: ToursList
  },
  {
    path: '/tour/:id',
    name: 'tour-detail',
    component: TourDetail
  },
  {
    path: '/tour/:id/booking',
    name: 'tour-booking',
    component: TourBooking
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesPage
  },
  {
    path: '/become-host',
    name: 'become-host',
    component: BecomeHost
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: MyTrips
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/dashboard/Profile.vue')
  },
  {
    path: '/dashboard/watchlist',
    name: 'wishlist',
    component: Wishlist
  },
  {
    path: '/dashboard/old',
    name: 'dashboard-old',
    component: UserDashboard
  },
  {
    path: '/trip-cart',
    name: 'trip-cart',
    component: TripCart
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard
  },
  {
    path: '/vendor',
    name: 'vendor',
    component: VendorDashboard
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
