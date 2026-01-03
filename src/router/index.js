import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/services/supabase'
import { useUserStore } from '@/stores/userStore'
import { useTranslation } from '@/composables/useTranslation'

// Critical routes - load immediately
import Home from '../views/home/Home.vue'
import Login from '../views/onboarding/Login.vue'
import Signup from '../views/onboarding/Signup.vue'

// Lazy load all other routes for better performance
const SplashScreen = () => import('../views/onboarding/SplashScreen.vue')
const WelcomeSlider = () => import('../views/onboarding/WelcomeSlider.vue')
const ForgotPassword = () => import('../views/onboarding/ForgotPassword.vue')
const ResetPassword = () => import('../views/onboarding/ResetPassword.vue')
const AuthCallback = () => import('../views/onboarding/AuthCallback.vue')

// Home
const PropertyHome = () => import('../views/home/PropertyHome.vue')

// About
const About = () => import('../views/about/About.vue')

// Accommodation - lazy load for better initial load
const AccommodationList = () => import('../views/accommodation/AccommodationList.vue')
const AccommodationDetail = () => import('../views/accommodation/AccommodationDetail.vue')
const AccommodationCheckout = () => import('../views/accommodation/AccommodationCheckout.vue')

// Transport
const TransportList = () => import('../views/transport/TransportList.vue')
const TransportBooking = () => import('../views/transport/TransportBooking.vue')
const TransportServices = () => import('../views/transport/TransportServices.vue')

// Tours
const ToursList = () => import('../views/tours/ToursList.vue')
const TourDetail = () => import('../views/tours/TourDetail.vue')
const TourBooking = () => import('../views/tours/TourBooking.vue')
const ToursPage = () => import('../views/tours/ToursPage.vue')

// Services
const ServicesPage = () => import('../views/services/ServicesPage.vue')

// Host
const BecomeHost = () => import('../views/host/BecomeHost.vue')

// Dashboard
const UserDashboard = () => import('../views/dashboard/UserDashboard.vue')
const MyTrips = () => import('../views/dashboard/MyTrips.vue')
const Messages = () => import('../views/dashboard/Messages.vue')

// Cart
const TripCart = () => import('../views/cart/TripCart.vue')
const Checkout = () => import('../views/cart/Checkout.vue')

// Wishlist
const Wishlist = () => import('../views/wishlist/Wishlist.vue')

// Stories
const Stories = () => import('../views/stories/Stories.vue')

// Admin - heavy pages, definitely lazy load
const AdminDashboard = () => import('../views/admin/AdminDashboard.vue')
const ManageProperties = () => import('../views/admin/ManageProperties.vue')
const AdminAccommodations = () => import('../views/admin/AdminAccommodations.vue')
const AdminUsers = () => import('../views/admin/AdminUsers.vue')
const AdminTours = () => import('../views/admin/AdminTours.vue')
const AdminTransport = () => import('../views/admin/AdminTransport.vue')
const AdminPayments = () => import('../views/admin/AdminPayments.vue')
const AdminAnalytics = () => import('../views/admin/AdminAnalytics.vue')
const AdminHostApplications = () => import('../views/admin/AdminHostApplications.vue')

// Vendor
const VendorDashboard = () => import('../views/vendor/VendorDashboard.vue')
const CreateProperty = () => import('../views/vendor/CreateProperty.vue')
const CreateTour = () => import('../views/vendor/CreateTour.vue')
const CreateTransport = () => import('../views/vendor/CreateTransport.vue')

// Staff
const StaffDashboard = () => import('../views/staff/StaffDashboard.vue')
const StaffProperties = () => import('../views/staff/StaffProperties.vue')
const StaffAddProperty = () => import('../views/staff/StaffAddProperty.vue')

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
    path: '/host/create-tour',
    name: 'host-create-tour',
    component: CreateTour,
    meta: { requiresAuth: true, requiresHost: true }
  },
  {
    path: '/host/create-transport',
    name: 'host-create-transport',
    component: CreateTransport,
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
  },
  {
    path: '/staff/create-tour',
    name: 'staff-create-tour',
    component: CreateTour,
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: '/staff/create-transport',
    name: 'staff-create-transport',
    component: CreateTransport,
    meta: { requiresAuth: true, requiresStaff: true }
  },
  // Admin tour and transport creation routes
  {
    path: '/admin/create-tour',
    name: 'admin-create-tour',
    component: CreateTour,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/create-transport',
    name: 'admin-create-transport',
    component: CreateTransport,
    meta: { requiresAuth: true, requiresAdmin: true }
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
