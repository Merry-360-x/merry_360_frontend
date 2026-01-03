import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useUserStore } from '@/stores/userStore'
import { useTranslation } from '@/composables/useTranslation'
import { waitForPreload } from '@/services/preloadData'

// Onboarding
import SplashScreen from '../views/onboarding/SplashScreen.vue'
import WelcomeSlider from '../views/onboarding/WelcomeSlider.vue'
import Login from '../views/onboarding/Login.vue'
import Signup from '../views/onboarding/Signup.vue'
import ForgotPassword from '../views/onboarding/ForgotPassword.vue'
import ResetPassword from '../views/onboarding/ResetPassword.vue'
import AuthCallback from '../views/onboarding/AuthCallback.vue'

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
import Messages from '../views/dashboard/Messages.vue'

// Cart
import TripCart from '../views/cart/TripCart.vue'
import Checkout from '../views/cart/Checkout.vue'

// Wishlist
import Wishlist from '../views/wishlist/Wishlist.vue'

// Stories
import Stories from '../views/stories/Stories.vue'

// Admin
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import ManageProperties from '../views/admin/ManageProperties.vue'
import AdminAccommodations from '../views/admin/AdminAccommodations.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminTours from '../views/admin/AdminTours.vue'
import AdminTransport from '../views/admin/AdminTransport.vue'
import AdminPayments from '../views/admin/AdminPayments.vue'
import AdminAnalytics from '../views/admin/AdminAnalytics.vue'
import AdminHostApplications from '../views/admin/AdminHostApplications.vue'

// Vendor
import VendorDashboard from '../views/vendor/VendorDashboard.vue'
import CreateProperty from '../views/vendor/CreateProperty.vue'
import CreateTour from '../views/vendor/CreateTour.vue'
import CreateTransport from '../views/vendor/CreateTransport.vue'

// Staff
import StaffDashboard from '../views/staff/StaffDashboard.vue'
import StaffProperties from '../views/staff/StaffProperties.vue'
import StaffAddProperty from '../views/staff/StaffAddProperty.vue'

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
    path: '/auth/callback',
    name: 'auth-callback',
    component: AuthCallback
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
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword
  },
  {
    path: '/stories',
    name: 'stories',
    component: Stories
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
    path: '/host',
    name: 'host',
    component: StaffDashboard,
    meta: { requiresAuth: true, requiresHost: true }
  },
  {
    path: '/host/properties',
    name: 'host-properties',
    component: StaffProperties,
    meta: { requiresAuth: true, requiresHost: true }
  },
  {
    path: '/host/add-property',
    name: 'host-add-property',
    component: StaffAddProperty,
    meta: { requiresAuth: true, requiresHost: true }
  },
  {
    path: '/host/edit-property/:id',
    name: 'host-edit-property',
    component: StaffAddProperty,
    meta: { requiresAuth: true, requiresHost: true }
  },
  {
    path: '/dashboard',
    redirect: '/profile'
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/dashboard/Profile.vue')
  },
  {
    path: '/messages',
    name: 'messages',
    component: Messages
  },
  {
    path: '/messages/:id',
    name: 'message-thread',
    component: Messages
  },
  {
    path: '/my-trips',
    redirect: '/profile'
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
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/accommodations',
    name: 'admin-accommodations',
    component: AdminAccommodations,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/properties',
    name: 'admin-properties',
    component: ManageProperties,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/tours',
    name: 'admin-tours',
    component: AdminTours,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/transport',
    name: 'admin-transport',
    component: AdminTransport,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/payments',
    name: 'admin-payments',
    component: AdminPayments,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/analytics',
    name: 'admin-analytics',
    component: AdminAnalytics,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/host-applications',
    name: 'admin-host-applications',
    component: AdminHostApplications,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/vendor',
    name: 'vendor',
    component: VendorDashboard,
    meta: { requiresAuth: true, requiresVendor: true }
  },
  {
    path: '/vendor/create-property',
    name: 'create-property',
    component: CreateProperty,
    meta: { requiresAuth: true, requiresVendor: true }
  },
  {
    path: '/vendor/create-tour',
    name: 'create-tour',
    component: CreateTour,
    meta: { requiresAuth: true, requiresVendor: true }
  },
  {
    path: '/vendor/create-transport',
    name: 'create-transport',
    component: CreateTransport,
    meta: { requiresAuth: true, requiresVendor: true }
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  // Staff routes
  {
    path: '/staff',
    name: 'staff',
    component: StaffDashboard,
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: '/staff/properties',
    name: 'staff-properties',
    component: StaffProperties,
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: '/staff/add-property',
    name: 'staff-add-property',
    component: StaffAddProperty,
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: '/staff/edit-property/:id',
    name: 'staff-edit-property',
    component: StaffAddProperty,
    meta: { requiresAuth: true, requiresStaff: true }
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

// Navigation guard for admin routes
router.beforeEach(async (to, from, next) => {
  // Preload critical data for instant page loads (home & accommodations)
  if (to.path === '/' || to.path === '/accommodations') {
    await waitForPreload()
  }

  const { t } = useTranslation()
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresStaff = to.matched.some(record => record.meta.requiresStaff)
  const requiresHost = to.matched.some(record => record.meta.requiresHost)
  const requiresVendor = to.matched.some(record => record.meta.requiresVendor)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAdmin || requiresStaff || requiresHost || requiresVendor || requiresAuth) {
    const store = useUserStore()

    // Ensure auth/profile loaded
    if (!store.initialized) {
      try { await store.initAuth() } catch (_) {}
    }

    // Must have a Supabase session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    // Check admin access
    if (requiresAdmin && store.user?.role !== 'admin') {
      alert(t('auth.accessDeniedAdmin'))
      next({ name: 'home' })
      return
    }

    // Check staff access (staff or admin can access)
    if (requiresStaff && store.user?.role !== 'staff' && store.user?.role !== 'admin') {
      alert(t('auth.accessDeniedStaff'))
      next({ name: 'home' })
      return
    }

    // Check host access (host or admin can access)
    if (requiresHost && store.user?.role !== 'host' && store.user?.role !== 'admin') {
      alert(t('auth.accessDeniedHost'))
      next({ name: 'home' })
      return
    }

    // Check vendor access (vendor, host, or admin can access)
    if (
      requiresVendor &&
      store.user?.role !== 'vendor' &&
      store.user?.role !== 'host' &&
      store.user?.role !== 'admin'
    ) {
      alert(t('auth.accessDeniedVendor'))
      next({ name: 'home' })
      return
    }
  }
  
  next()
})

export default router
