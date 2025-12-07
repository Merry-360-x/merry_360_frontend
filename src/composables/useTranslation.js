import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'

const translations = {
  EN: {
    // Navigation
    'nav.home': 'Home',
    'nav.accommodations': 'Accommodations',
    'nav.tours': 'Tours',
    'nav.transport': 'Transport',
    'nav.services': 'Services',
    'nav.myTrips': 'My Trips',
    'nav.login': 'Login',
    
    // Home Page
    'home.welcome': 'Welcome to Merry360',
    'home.tagline': 'Find the best accommodations, transport, tours, and services for your next adventure. Add them to your trip cart and book everything in one go.',
    'home.search': 'Search',
    'home.whatLookingFor': 'What are you looking for?',
    'home.accommodations': 'Accommodations',
    'home.toursActivities': 'Tours & Activities',
    'home.transportation': 'Transportation',
    'home.aiConcierge': 'AI Concierge',
    'home.recommendedStays': 'Recommended Stays',
    'home.featuredTours': 'Featured Tours',
    'home.nearbyProperties': 'Nearby Listed Properties',
    'home.topRated': 'Top Rated Properties',
    'home.featured': 'Featured Properties on our Listing',
    'home.guides': 'Property Rental Guides & Tips',
    'home.viewAll': 'View all',
    'home.viewMore': 'View more',
    
    // Search Form
    'search.whereGoing': 'Where are you going?',
    'search.checkIn': 'Check-in',
    'search.checkOut': 'Check-out',
    'search.adults': 'Adults',
    'search.rooms': 'Rooms',
    
    // Transport
    'transport.title': 'Transportation Services',
    'transport.subtitle': 'Get around Rwanda with ease',
    'transport.taxi': 'Taxi Service',
    'transport.taxiDesc': 'Quick rides around the city',
    'transport.shuttle': 'Shuttle Service',
    'transport.shuttleDesc': 'Shared rides to popular destinations',
    'transport.carRental': 'Car Rental',
    'transport.carRentalDesc': 'Rent a vehicle for your journey',
    'transport.bookTaxi': 'Book Taxi',
    'transport.bookShuttle': 'Book Shuttle',
    'transport.browseCars': 'Browse Cars',
    'transport.popularRoutes': 'Popular Routes',
    'transport.bookNow': 'Book Now',
    
    // Tours
    'tours.title': 'Tours & Experiences',
    'tours.subtitle': 'Discover the beauty of Rwanda',
    'tours.all': 'All',
    'tours.nature': 'Nature',
    'tours.adventure': 'Adventure',
    'tours.cultural': 'Cultural',
    'tours.wildlife': 'Wildlife',
    'tours.historical': 'Historical',
    'tours.bookNow': 'Book Now',
    
    // Services
    'services.title': 'Services',
    'services.subtitle': 'Everything you need for a perfect trip',
    'services.bookNow': 'Book Now',
    
    // My Trips
    'myTrips.title': 'My Trips',
    'myTrips.subtitle': 'Manage your bookings and travel plans',
    'myTrips.upcoming': 'Upcoming Trips',
    'myTrips.saved': 'Saved',
    'myTrips.cartItems': 'Cart Items',
    'myTrips.loyaltyPoints': 'Loyalty Points',
    'myTrips.upcomingTab': 'Upcoming',
    'myTrips.pastTab': 'Past',
    'myTrips.savedTab': 'Saved',
    
    // Cart
    'cart.title': 'Your Trip Cart',
    'cart.subtitle': 'Review and book everything in one go',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Add accommodations, tours, and services to your cart',
    'cart.startPlanning': 'Start Planning',
    'cart.items': 'Cart Items',
    'cart.orderSummary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Discount',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    'cart.clearAll': 'Clear All',
    
    // Wishlist
    'wishlist.title': 'My Wishlist',
    'wishlist.subtitle': 'Your saved items',
    'wishlist.empty': 'Your wishlist is empty',
    'wishlist.emptyDesc': 'Start adding items to your wishlist',
    'wishlist.explore': 'Explore',
    'wishlist.addToCart': 'Add to Trip Cart',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    
    // Hero Section
    'hero.title': 'Driving Success for Real Estate Owners & Tourism Brands',
    'hero.tagline': 'Tailored Marketing & Management solutions for your business needs in Rwanda',
    
    // Services Section
    'services.salesMarketing': 'Sales & Marketing',
    'services.salesDesc': 'Revenue Growth',
    'services.management': 'Management',
    'services.managementDesc': 'Property & Operations',
    'services.marketInsights': 'Market Insights',
    'services.marketInsightsDesc': 'Data & Analytics',
    'services.crmLeads': 'CRM & Leads',
    'services.crmLeadsDesc': 'Lead Generation',
    'services.aiConcierge': 'AI Concierge',
    'services.aiConciergeDesc': 'Ask me anything!',
    
    // About Section
    'about.title': 'Your Partner in Business Growth',
    'about.description': 'At Merry360Global, we specialize in providing comprehensive marketing and management solutions tailored to the real estate and tourism sectors in Rwanda. Our mission is to drive sustainable growth for property owners and tourism brands through innovative strategies, data-driven insights, and exceptional service delivery.',
    'about.propertiesManaged': 'Properties Managed',
    'about.customersServed': 'Customers Served',
    
    // Accommodation Details
    'accommodation.details': 'Details',
    'accommodation.amenities': 'Amenities',
    'accommodation.reviews': 'Reviews',
    'accommodation.location': 'Location',
    'accommodation.host': 'Your Host',
    'accommodation.getDirections': 'Get Directions',
    'accommodation.addToCart': 'Add to Trip Cart',
    'accommodation.reserveNow': 'Reserve Now',
    'accommodation.perNight': 'per night',
    'accommodation.checkIn': 'dd/mm/yyyy',
    'accommodation.checkOut': 'dd/mm/yyyy',
    'accommodation.guests': 'Guests',
    'accommodation.bedrooms': 'Bedrooms',
    'accommodation.bathrooms': 'Bathrooms',
    'accommodation.checkAvailability': 'Check Availability',
    'accommodation.entirePlace': 'Entire place',
    'accommodation.privateRoom': 'Private room',
    'accommodation.sharedRoom': 'Shared room',
    
    // Stories
    'stories.title': 'Guest Stories',
    'stories.subtitle': 'Experiences from our community',
    'stories.viewStory': 'View Story',
    'stories.noStories': 'No stories yet',
    'stories.shareYourStory': 'Share Your Story',
    
    // Checkout
    'checkout.title': 'Complete Your Booking',
    'checkout.bookingSummary': 'Booking Summary',
    'checkout.guestDetails': 'Guest Details',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.cardPayment': 'Credit/Debit Card',
    'checkout.mobileMoney': 'Mobile Money',
    'checkout.crypto': 'Cryptocurrency',
    'checkout.fullName': 'Full Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone Number',
    'checkout.specialRequests': 'Special Requests',
    'checkout.priceBreakdown': 'Price Breakdown',
    'checkout.nightlyRate': 'Nightly Rate',
    'checkout.nights': 'nights',
    'checkout.serviceFee': 'Service Fee',
    'checkout.taxes': 'Taxes & Fees',
    'checkout.totalPrice': 'Total Price',
    'checkout.confirmBooking': 'Confirm Booking',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.upcomingTrips': 'Upcoming Trips',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.savedItems': 'Saved Items',
    'dashboard.accountSettings': 'Account Settings',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.forgotPassword': 'Forgot Password',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.rememberMe': 'Remember me',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
  },
  
  RW: {
    // Navigation
    'nav.home': 'Ahabanza',
    'nav.accommodations': 'Aho Guturamo',
    'nav.tours': 'Urugendo',
    'nav.transport': 'Ibinyabiziga',
    'nav.services': 'Serivisi',
    'nav.myTrips': 'Ingendo Zanjye',
    'nav.login': 'Kwinjira',
    
    // Home Page
    'home.welcome': 'Murakaza Neza kuri Merry360',
    'home.tagline': 'Shakisha aho guturamo, ibinyabiziga, ingendo, na serivisi zizewe. Shyiramo mugikarito ugure byose icyarimwe.',
    'home.search': 'Shakisha',
    'home.whatLookingFor': 'Urashaka iki?',
    'home.accommodations': 'Aho Guturamo',
    'home.toursActivities': 'Ingendo & Ibikorwa',
    'home.transportation': 'Ibinyabiziga',
    'home.aiConcierge': 'AI Concierge',
    'home.recommendedStays': 'Aho Guturamo Dusaba',
    'home.featuredTours': 'Ingendo Zidasanzwe',
    'home.nearbyProperties': 'Aho Guturamo Hafi',
    'home.topRated': 'Aho Guturamo Kuzuye',
    'home.featured': 'Aho Guturamo Dusaba',
    'home.guides': 'Amabwiriza yo Gukodesha',
    'home.viewAll': 'Reba byose',
    'home.viewMore': 'Reba birenze',
    
    // Search Form
    'search.whereGoing': 'Uragana he?',
    'search.checkIn': 'Italiki yinjira',
    'search.checkOut': 'Italiki usohoka',
    'search.adults': 'Abantu Bakuru',
    'search.rooms': 'Ibyumba',
    
    // Transport
    'transport.title': 'Serivisi zo Gutwara Abantu',
    'transport.subtitle': 'Genda hose mu Rwanda byoroshye',
    'transport.taxi': 'Taxi',
    'transport.taxiDesc': 'Ingendo zihuse mumujyi',
    'transport.shuttle': 'Shuttle',
    'transport.shuttleDesc': 'Ingendo zihuye nabantu benshi',
    'transport.carRental': 'Gukodesha Imodoka',
    'transport.carRentalDesc': 'Kodesha imodoka kurugendo rwawe',
    'transport.bookTaxi': 'Tanga Taxi',
    'transport.bookShuttle': 'Tanga Shuttle',
    'transport.browseCars': 'Reba Imodoka',
    'transport.popularRoutes': 'Inzira Zizwi',
    'transport.bookNow': 'Tanga Ubu',
    
    // Tours
    'tours.title': 'Ingendo & Uburambe',
    'tours.subtitle': 'Vugurura ubwiza bwa Rwanda',
    'tours.all': 'Byose',
    'tours.nature': 'Kamere',
    'tours.adventure': 'Uburambe',
    'tours.cultural': 'Umuco',
    'tours.wildlife': 'Inyamaswa',
    'tours.historical': 'Amateka',
    'tours.bookNow': 'Tanga Ubu',
    
    // Services
    'services.title': 'Serivisi',
    'services.subtitle': 'Ibyo ukeneye byose kurugendo rwawe',
    'services.bookNow': 'Tanga Ubu',
    
    // My Trips
    'myTrips.title': 'Ingendo Zanjye',
    'myTrips.subtitle': 'Genzura ingendo zawe',
    'myTrips.upcoming': 'Ingendo Zizaza',
    'myTrips.saved': 'Byabitswe',
    'myTrips.cartItems': 'Ibintu Mugikarito',
    'myTrips.loyaltyPoints': 'Amanota',
    'myTrips.upcomingTab': 'Zizaza',
    'myTrips.pastTab': 'Zarangiye',
    'myTrips.savedTab': 'Byabitswe',
    
    // Cart
    'cart.title': 'Igikarito Cyawe',
    'cart.subtitle': 'Suzuma ugure byose icyarimwe',
    'cart.empty': 'Igikarito cyawe cyuzuye',
    'cart.emptyDesc': 'Shyiramo aho guturamo, ingendo na serivisi',
    'cart.startPlanning': 'Tangira Gutegura',
    'cart.items': 'Ibintu Mugikarito',
    'cart.orderSummary': 'Incamake yIbintu',
    'cart.subtotal': 'Igiteranyo',
    'cart.discount': 'Kugabanyirizwa',
    'cart.total': 'Igiteranyo',
    'cart.checkout': 'Komeza Kugura',
    'cart.remove': 'Kuraho',
    'cart.clearAll': 'Siba Byose',
    
    // Wishlist
    'wishlist.title': 'Ibyo Nifuza',
    'wishlist.subtitle': 'Ibintu byawe byabitswe',
    'wishlist.empty': 'Ibyo wifuza ntabyo',
    'wishlist.emptyDesc': 'Tangira kongeramo ibintu',
    'wishlist.explore': 'Shakisha',
    'wishlist.addToCart': 'Shyiramo Mugikarito',
    
    // Common
    'common.loading': 'Birimo Gutegurwa...',
    'common.error': 'Ikosa',
    'common.success': 'Byakunze',
    'common.cancel': 'Hagarika',
    'common.confirm': 'Emeza',
    'common.save': 'Bika',
    'common.delete': 'Siba',
    'common.edit': 'Hindura',
    
    // Hero Section
    'hero.title': 'Gutera Intsinzi Abafite Imitungo n\'Ubucuruzi bw\'Ubukerarugendo',
    'hero.tagline': 'Ibisubizo bya Marketing na Management bikwiranye n\'ubucuruzi bwawe mu Rwanda',
    
    // Services Section
    'services.salesMarketing': 'Kugurisha & Marketing',
    'services.salesDesc': 'Kwiyongera kw\'Amafaranga',
    'services.management': 'Ubucuruzi',
    'services.managementDesc': 'Imitungo & Ibikorwa',
    'services.marketInsights': 'Amakuru y\'Isoko',
    'services.marketInsightsDesc': 'Amakuru & Isesengura',
    'services.crmLeads': 'CRM & Abakiriya',
    'services.crmLeadsDesc': 'Gushaka Abakiriya',
    'services.aiConcierge': 'AI Concierge',
    'services.aiConciergeDesc': 'Baza ikintu icyo ari cyo cyose!',
    
    // About Section
    'about.title': 'Umufatanyabikorwa wawe mu Gukura kw\'Ubucuruzi',
    'about.description': 'Muri Merry360Global, twitanze ibisubizo byuzuye bya marketing na management byubatswe ku bucuruzi bw\'imitungo n\'ubukerarugendo mu Rwanda. Intego yacu ni ukutera imbere gukura gukomeza kubafite imitungo n\'ubucuruzi bw\'ubukerarugendo binyuze mu ngamba z\'ubuhanga, amakuru ashingiye ku makuru, n\'imirimo myiza.',
    'about.propertiesManaged': 'Imitungo Icungwa',
    'about.customersServed': 'Abakiriya Bakoranye',
    
    // Accommodation Details
    'accommodation.details': 'Ibisobanuro',
    'accommodation.amenities': 'Ibikoresho',
    'accommodation.reviews': 'Ibitekerezo',
    'accommodation.location': 'Aho Giherereye',
    'accommodation.host': 'Nyirawo',
    'accommodation.getDirections': 'Reba Inzira',
    'accommodation.addToCart': 'Shyiramo Mugikarito',
    'accommodation.reserveNow': 'Tanga Ubu',
    'accommodation.perNight': 'ku ijoro',
    'accommodation.guests': 'Abashyitsi',
    'accommodation.bedrooms': 'Ibyumba byo Kuraramo',
    'accommodation.bathrooms': 'Ibyumba byo Kwoga',
    'accommodation.checkAvailability': 'Reba Kuboneka',
    'accommodation.entirePlace': 'Ahantu hose',
    'accommodation.privateRoom': 'Icyumba cyihariye',
    'accommodation.sharedRoom': 'Icyumba gisangiye',
    
    // Stories
    'stories.title': 'Inkuru z\'Abashyitsi',
    'stories.subtitle': 'Uburambe bw\'Abanyamuryango',
    'stories.viewStory': 'Reba Inkuru',
    'stories.noStories': 'Nta nkuru ziriho',
    'stories.shareYourStory': 'Sangiza Inkuru Yawe',
    
    // Checkout
    'checkout.title': 'Soza Gutanga Kwawe',
    'checkout.bookingSummary': 'Incamake yo Gutanga',
    'checkout.guestDetails': 'Ibyangombwa by\'Umushyitsi',
    'checkout.paymentMethod': 'Uburyo bwo Kwishyura',
    'checkout.cardPayment': 'Ikarita yo Kwishyura',
    'checkout.mobileMoney': 'Mobile Money',
    'checkout.crypto': 'Cryptocurrency',
    'checkout.fullName': 'Amazina Yose',
    'checkout.email': 'Email',
    'checkout.phone': 'Nimero ya Telefone',
    'checkout.specialRequests': 'Ibyifuzo Byihariye',
    'checkout.priceBreakdown': 'Ibyerekeye Igiciro',
    'checkout.nightlyRate': 'Igiciro kuri Buri Joro',
    'checkout.nights': 'amajoro',
    'checkout.serviceFee': 'Amafaranga ya Serivisi',
    'checkout.taxes': 'Imisoro n\'Amafaranga',
    'checkout.totalPrice': 'Igiciro Cyose',
    'checkout.confirmBooking': 'Emeza Gutanga',
    
    // Dashboard
    'dashboard.welcome': 'Murakaza Neza',
    'dashboard.upcomingTrips': 'Ingendo Zizaza',
    'dashboard.recentActivity': 'Ibikorwa Bishya',
    'dashboard.savedItems': 'Ibintu Byabitswe',
    'dashboard.accountSettings': 'Igenamiterere ry\'Konti',
    
    // Auth
    'auth.login': 'Kwinjira',
    'auth.signup': 'Kwiyandikisha',
    'auth.logout': 'Gusohoka',
    'auth.forgotPassword': 'Wibagiwe Ijambo Banga',
    'auth.email': 'Email',
    'auth.password': 'Ijambo Banga',
    'auth.confirmPassword': 'Emeza Ijambo Banga',
    'auth.rememberMe': 'Nyibuka',
    'auth.dontHaveAccount': 'Ntufite Konti?',
    'auth.alreadyHaveAccount': 'Usanzwe Ufite Konti?',
  },
  
  FR: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.accommodations': 'Hébergements',
    'nav.tours': 'Circuits',
    'nav.transport': 'Transport',
    'nav.services': 'Services',
    'nav.myTrips': 'Mes Voyages',
    'nav.login': 'Connexion',
    
    // Home Page
    'home.welcome': 'Bienvenue à Merry360',
    'home.tagline': 'Trouvez les meilleurs hébergements, transports, circuits et services pour votre prochaine aventure. Ajoutez-les à votre panier et réservez tout en une seule fois.',
    'home.search': 'Rechercher',
    'home.whatLookingFor': 'Que cherchez-vous?',
    'home.accommodations': 'Hébergements',
    'home.toursActivities': 'Circuits & Activités',
    'home.transportation': 'Transport',
    'home.aiConcierge': 'Concierge IA',
    'home.recommendedStays': 'Séjours Recommandés',
    'home.featuredTours': 'Circuits en Vedette',
    'home.nearbyProperties': 'Propriétés à Proximité',
    'home.topRated': 'Mieux Notés',
    'home.featured': 'Propriétés en Vedette',
    'home.guides': 'Guides de Location',
    'home.viewAll': 'Voir tout',
    'home.viewMore': 'Voir plus',
    
    // Search Form
    'search.whereGoing': 'Où allez-vous?',
    'search.checkIn': 'Arrivée',
    'search.checkOut': 'Départ',
    'search.adults': 'Adultes',
    'search.rooms': 'Chambres',
    
    // Transport
    'transport.title': 'Services de Transport',
    'transport.subtitle': 'Déplacez-vous facilement au Rwanda',
    'transport.taxi': 'Service Taxi',
    'transport.taxiDesc': 'Trajets rapides en ville',
    'transport.shuttle': 'Service Navette',
    'transport.shuttleDesc': 'Trajets partagés vers destinations populaires',
    'transport.carRental': 'Location de Voiture',
    'transport.carRentalDesc': 'Louez un véhicule pour votre voyage',
    'transport.bookTaxi': 'Réserver Taxi',
    'transport.bookShuttle': 'Réserver Navette',
    'transport.browseCars': 'Voir Voitures',
    'transport.popularRoutes': 'Itinéraires Populaires',
    'transport.bookNow': 'Réserver',
    
    // Tours
    'tours.title': 'Circuits & Expériences',
    'tours.subtitle': 'Découvrez la beauté du Rwanda',
    'tours.all': 'Tous',
    'tours.nature': 'Nature',
    'tours.adventure': 'Aventure',
    'tours.cultural': 'Culturel',
    'tours.wildlife': 'Faune',
    'tours.historical': 'Historique',
    'tours.bookNow': 'Réserver',
    
    // Services
    'services.title': 'Services',
    'services.subtitle': 'Tout ce dont vous avez besoin pour un voyage parfait',
    'services.bookNow': 'Réserver',
    
    // My Trips
    'myTrips.title': 'Mes Voyages',
    'myTrips.subtitle': 'Gérez vos réservations et plans',
    'myTrips.upcoming': 'Voyages à Venir',
    'myTrips.saved': 'Sauvegardés',
    'myTrips.cartItems': 'Articles du Panier',
    'myTrips.loyaltyPoints': 'Points de Fidélité',
    'myTrips.upcomingTab': 'À Venir',
    'myTrips.pastTab': 'Passés',
    'myTrips.savedTab': 'Sauvegardés',
    
    // Cart
    'cart.title': 'Votre Panier',
    'cart.subtitle': 'Vérifiez et réservez tout en une fois',
    'cart.empty': 'Votre panier est vide',
    'cart.emptyDesc': 'Ajoutez hébergements, circuits et services',
    'cart.startPlanning': 'Commencer à Planifier',
    'cart.items': 'Articles du Panier',
    'cart.orderSummary': 'Résumé de la Commande',
    'cart.subtotal': 'Sous-total',
    'cart.discount': 'Réduction',
    'cart.total': 'Total',
    'cart.checkout': 'Passer la Commande',
    'cart.remove': 'Retirer',
    'cart.clearAll': 'Tout Vider',
    
    // Wishlist
    'wishlist.title': 'Ma Liste de Souhaits',
    'wishlist.subtitle': 'Vos articles sauvegardés',
    'wishlist.empty': 'Votre liste est vide',
    'wishlist.emptyDesc': 'Commencez à ajouter des articles',
    'wishlist.explore': 'Explorer',
    'wishlist.addToCart': 'Ajouter au Panier',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    
    // Hero Section
    'hero.title': 'Stimuler le Succès pour les Propriétaires Immobiliers et les Marques Touristiques',
    'hero.tagline': 'Solutions de Marketing et Gestion sur mesure pour vos besoins au Rwanda',
    
    // Services Section
    'services.salesMarketing': 'Ventes & Marketing',
    'services.salesDesc': 'Croissance des Revenus',
    'services.management': 'Gestion',
    'services.managementDesc': 'Propriété & Opérations',
    'services.marketInsights': 'Insights du Marché',
    'services.marketInsightsDesc': 'Données & Analyses',
    'services.crmLeads': 'CRM & Prospects',
    'services.crmLeadsDesc': 'Génération de Prospects',
    'services.aiConcierge': 'IA Concierge',
    'services.aiConciergeDesc': 'Posez-moi n\'importe quoi!',
    
    // About Section
    'about.title': 'Votre Partenaire pour la Croissance',
    'about.description': 'Chez Merry360Global, nous nous spécialisons dans la fourniture de solutions complètes de marketing et de gestion adaptées aux secteurs de l\'immobilier et du tourisme au Rwanda. Notre mission est de stimuler une croissance durable pour les propriétaires immobiliers et les marques touristiques grâce à des stratégies innovantes, des insights basés sur les données et une prestation de services exceptionnelle.',
    'about.propertiesManaged': 'Propriétés Gérées',
    'about.customersServed': 'Clients Servis',
    
    // Accommodation Details
    'accommodation.details': 'Détails',
    'accommodation.amenities': 'Équipements',
    'accommodation.reviews': 'Avis',
    'accommodation.location': 'Emplacement',
    'accommodation.host': 'Votre Hôte',
    'accommodation.getDirections': 'Obtenir les Directions',
    'accommodation.addToCart': 'Ajouter au Panier',
    'accommodation.reserveNow': 'Réserver Maintenant',
    'accommodation.perNight': 'par nuit',
    'accommodation.guests': 'Invités',
    'accommodation.bedrooms': 'Chambres',
    'accommodation.bathrooms': 'Salles de Bain',
    'accommodation.checkAvailability': 'Vérifier Disponibilité',
    'accommodation.entirePlace': 'Logement entier',
    'accommodation.privateRoom': 'Chambre privée',
    'accommodation.sharedRoom': 'Chambre partagée',
    
    // Stories
    'stories.title': 'Histoires d\'Invités',
    'stories.subtitle': 'Expériences de notre communauté',
    'stories.viewStory': 'Voir l\'Histoire',
    'stories.noStories': 'Pas encore d\'histoires',
    'stories.shareYourStory': 'Partagez Votre Histoire',
    
    // Checkout
    'checkout.title': 'Finalisez Votre Réservation',
    'checkout.bookingSummary': 'Résumé de Réservation',
    'checkout.guestDetails': 'Détails de l\'Invité',
    'checkout.paymentMethod': 'Méthode de Paiement',
    'checkout.cardPayment': 'Carte de Crédit/Débit',
    'checkout.mobileMoney': 'Mobile Money',
    'checkout.crypto': 'Cryptomonnaie',
    'checkout.fullName': 'Nom Complet',
    'checkout.email': 'Email',
    'checkout.phone': 'Numéro de Téléphone',
    'checkout.specialRequests': 'Demandes Spéciales',
    'checkout.priceBreakdown': 'Détails du Prix',
    'checkout.nightlyRate': 'Tarif par Nuit',
    'checkout.nights': 'nuits',
    'checkout.serviceFee': 'Frais de Service',
    'checkout.taxes': 'Taxes et Frais',
    'checkout.totalPrice': 'Prix Total',
    'checkout.confirmBooking': 'Confirmer la Réservation',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.upcomingTrips': 'Voyages à Venir',
    'dashboard.recentActivity': 'Activité Récente',
    'dashboard.savedItems': 'Articles Sauvegardés',
    'dashboard.accountSettings': 'Paramètres du Compte',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.logout': 'Déconnexion',
    'auth.forgotPassword': 'Mot de Passe Oublié',
    'auth.email': 'Email',
    'auth.password': 'Mot de Passe',
    'auth.confirmPassword': 'Confirmer le Mot de Passe',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.dontHaveAccount': 'Vous n\'avez pas de compte?',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte?',
  },
  
  ZH: {
    // Navigation
    'nav.home': '首页',
    'nav.accommodations': '住宿',
    'nav.tours': '旅游',
    'nav.transport': '交通',
    'nav.services': '服务',
    'nav.myTrips': '我的行程',
    'nav.login': '登录',
    
    // Home Page
    'home.welcome': '欢迎来到 Merry360',
    'home.tagline': '为您的下一次冒险寻找最佳住宿、交通、旅游和服务。将它们添加到购物车并一次性预订所有内容。',
    'home.search': '搜索',
    'home.whatLookingFor': '您在寻找什么？',
    'home.accommodations': '住宿',
    'home.toursActivities': '旅游与活动',
    'home.transportation': '交通',
    'home.aiConcierge': 'AI礼宾服务',
    'home.recommendedStays': '推荐住宿',
    'home.featuredTours': '精选旅游',
    'home.nearbyProperties': '附近房源',
    'home.topRated': '高评分房源',
    'home.featured': '精选房源',
    'home.guides': '租赁指南与提示',
    'home.viewAll': '查看全部',
    'home.viewMore': '查看更多',
    
    // Search Form
    'search.whereGoing': '您要去哪里？',
    'search.checkIn': '入住',
    'search.checkOut': '退房',
    'search.adults': '成人',
    'search.rooms': '房间',
    
    // Transport
    'transport.title': '交通服务',
    'transport.subtitle': '轻松游览卢旺达',
    'transport.taxi': '出租车服务',
    'transport.taxiDesc': '城市快速出行',
    'transport.shuttle': '班车服务',
    'transport.shuttleDesc': '前往热门目的地的共享乘车',
    'transport.carRental': '租车',
    'transport.carRentalDesc': '为您的旅程租赁车辆',
    'transport.bookTaxi': '预订出租车',
    'transport.bookShuttle': '预订班车',
    'transport.browseCars': '浏览车辆',
    'transport.popularRoutes': '热门路线',
    'transport.bookNow': '立即预订',
    
    // Tours
    'tours.title': '旅游与体验',
    'tours.subtitle': '探索卢旺达之美',
    'tours.all': '全部',
    'tours.nature': '自然',
    'tours.adventure': '冒险',
    'tours.cultural': '文化',
    'tours.wildlife': '野生动物',
    'tours.historical': '历史',
    'tours.bookNow': '立即预订',
    
    // Services
    'services.title': '服务',
    'services.subtitle': '完美旅行所需的一切',
    'services.bookNow': '立即预订',
    
    // My Trips
    'myTrips.title': '我的行程',
    'myTrips.subtitle': '管理您的预订和旅行计划',
    'myTrips.upcoming': '即将到来的行程',
    'myTrips.saved': '已保存',
    'myTrips.cartItems': '购物车项目',
    'myTrips.loyaltyPoints': '积分',
    'myTrips.upcomingTab': '即将到来',
    'myTrips.pastTab': '过去',
    'myTrips.savedTab': '已保存',
    
    // Cart
    'cart.title': '您的购物车',
    'cart.subtitle': '一次性查看并预订所有内容',
    'cart.empty': '您的购物车是空的',
    'cart.emptyDesc': '将住宿、旅游和服务添加到您的购物车',
    'cart.startPlanning': '开始规划',
    'cart.items': '购物车项目',
    'cart.orderSummary': '订单摘要',
    'cart.subtotal': '小计',
    'cart.discount': '折扣',
    'cart.total': '总计',
    'cart.checkout': '继续结账',
    'cart.remove': '移除',
    'cart.clearAll': '清空全部',
    
    // Wishlist
    'wishlist.title': '我的愿望清单',
    'wishlist.subtitle': '您保存的项目',
    'wishlist.empty': '您的愿望清单是空的',
    'wishlist.emptyDesc': '开始将项目添加到您的愿望清单',
    'wishlist.explore': '探索',
    'wishlist.addToCart': '添加到购物车',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    
    // Hero Section
    'hero.title': '推动房地产业主和旅游品牌的成功',
    'hero.tagline': '为您在卢旺达的业务需求量身定制的营销与管理解决方案',
    
    // Services Section
    'services.salesMarketing': '销售与营销',
    'services.salesDesc': '收入增长',
    'services.management': '管理',
    'services.managementDesc': '房产与运营',
    'services.marketInsights': '市场洞察',
    'services.marketInsightsDesc': '数据与分析',
    'services.crmLeads': 'CRM与客户',
    'services.crmLeadsDesc': '潜在客户开发',
    'services.aiConcierge': 'AI礼宾',
    'services.aiConciergeDesc': '问我任何问题！',
    
    // About Section
    'about.title': '您的业务增长合作伙伴',
    'about.description': '在 Merry360Global，我们专门为卢旺达的房地产和旅游行业提供全面的营销和管理解决方案。我们的使命是通过创新战略、数据驱动的洞察和卓越的服务交付，为房地产业主和旅游品牌推动可持续增长。',
    'about.propertiesManaged': '管理的房产',
    'about.customersServed': '服务的客户',
    
    // Accommodation Details
    'accommodation.details': '详细信息',
    'accommodation.amenities': '设施',
    'accommodation.reviews': '评价',
    'accommodation.location': '位置',
    'accommodation.host': '您的房东',
    'accommodation.getDirections': '获取路线',
    'accommodation.addToCart': '添加到购物车',
    'accommodation.reserveNow': '立即预订',
    'accommodation.perNight': '每晚',
    'accommodation.guests': '客人',
    'accommodation.bedrooms': '卧室',
    'accommodation.bathrooms': '浴室',
    'accommodation.checkAvailability': '查看可用性',
    'accommodation.entirePlace': '整套房源',
    'accommodation.privateRoom': '独立房间',
    'accommodation.sharedRoom': '合住房间',
    
    // Stories
    'stories.title': '客人故事',
    'stories.subtitle': '来自我们社区的体验',
    'stories.viewStory': '查看故事',
    'stories.noStories': '暂无故事',
    'stories.shareYourStory': '分享您的故事',
    
    // Checkout
    'checkout.title': '完成您的预订',
    'checkout.bookingSummary': '预订摘要',
    'checkout.guestDetails': '客人详情',
    'checkout.paymentMethod': '支付方式',
    'checkout.cardPayment': '信用卡/借记卡',
    'checkout.mobileMoney': '移动支付',
    'checkout.crypto': '加密货币',
    'checkout.fullName': '全名',
    'checkout.email': '电子邮件',
    'checkout.phone': '电话号码',
    'checkout.specialRequests': '特殊要求',
    'checkout.priceBreakdown': '价格明细',
    'checkout.nightlyRate': '每晚价格',
    'checkout.nights': '晚',
    'checkout.serviceFee': '服务费',
    'checkout.taxes': '税费',
    'checkout.totalPrice': '总价',
    'checkout.confirmBooking': '确认预订',
    
    // Dashboard
    'dashboard.welcome': '欢迎回来',
    'dashboard.upcomingTrips': '即将到来的行程',
    'dashboard.recentActivity': '最近活动',
    'dashboard.savedItems': '保存的项目',
    'dashboard.accountSettings': '账户设置',
    
    // Auth
    'auth.login': '登录',
    'auth.signup': '注册',
    'auth.logout': '退出',
    'auth.forgotPassword': '忘记密码',
    'auth.email': '电子邮件',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.rememberMe': '记住我',
    'auth.dontHaveAccount': '还没有账户？',
    'auth.alreadyHaveAccount': '已有账户？',
  },
  
  SW: {
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.accommodations': 'Makazi',
    'nav.tours': 'Safari',
    'nav.transport': 'Usafiri',
    'nav.services': 'Huduma',
    'nav.myTrips': 'Safari Zangu',
    'nav.login': 'Ingia',
    
    // Home Page
    'home.welcome': 'Karibu Merry360',
    'home.tagline': 'Tafuta makazi bora, usafiri, safari na huduma kwa ajili ya safari yako ijayo. Ongeza kwenye kikapu na uweke nafasi kwa mara moja.',
    'home.search': 'Tafuta',
    'home.whatLookingFor': 'Unatafuta nini?',
    'home.accommodations': 'Makazi',
    'home.toursActivities': 'Safari na Shughuli',
    'home.transportation': 'Usafiri',
    'home.aiConcierge': 'Msaidizi wa AI',
    'home.recommendedStays': 'Makazi Yaliyopendekezwa',
    'home.featuredTours': 'Safari Maarufu',
    'home.nearbyProperties': 'Mali Zilizo Karibu',
    'home.topRated': 'Mali Bora',
    'home.featured': 'Mali Maarufu',
    'home.guides': 'Miongozo ya Kukodisha',
    'home.viewAll': 'Tazama Zote',
    'home.viewMore': 'Tazama Zaidi',
    
    // Search Form
    'search.whereGoing': 'Unaenda wapi?',
    'search.checkIn': 'Tarehe ya Kuingia',
    'search.checkOut': 'Tarehe ya Kutoka',
    'search.adults': 'Watu Wazima',
    'search.rooms': 'Vyumba',
    
    // Transport
    'transport.title': 'Huduma za Usafiri',
    'transport.subtitle': 'Safiri kote Rwanda kwa urahisi',
    'transport.taxi': 'Huduma ya Teksi',
    'transport.taxiDesc': 'Safari za haraka mjini',
    'transport.shuttle': 'Huduma ya Basi',
    'transport.shuttleDesc': 'Safari za kushirikiana kwenda maeneo maarufu',
    'transport.carRental': 'Kukodisha Gari',
    'transport.carRentalDesc': 'Kodisha gari kwa ajili ya safari yako',
    'transport.bookTaxi': 'Weka Nafasi ya Teksi',
    'transport.bookShuttle': 'Weka Nafasi ya Basi',
    'transport.browseCars': 'Angalia Magari',
    'transport.popularRoutes': 'Njia Maarufu',
    'transport.bookNow': 'Weka Nafasi Sasa',
    
    // Tours
    'tours.title': 'Safari na Uzoefu',
    'tours.subtitle': 'Gundua uzuri wa Rwanda',
    'tours.all': 'Zote',
    'tours.nature': 'Asili',
    'tours.adventure': 'Uchunguzi',
    'tours.cultural': 'Utamaduni',
    'tours.wildlife': 'Wanyamapori',
    'tours.historical': 'Kihistoria',
    'tours.bookNow': 'Weka Nafasi Sasa',
    
    // Services
    'services.title': 'Huduma',
    'services.subtitle': 'Kila kitu unachohitaji kwa safari kamili',
    'services.bookNow': 'Weka Nafasi Sasa',
    
    // My Trips
    'myTrips.title': 'Safari Zangu',
    'myTrips.subtitle': 'Simamia uhifadhi wako na mipango ya safari',
    'myTrips.upcoming': 'Safari Zinazokuja',
    'myTrips.saved': 'Zilizohifadhiwa',
    'myTrips.cartItems': 'Vitu vya Kikapu',
    'myTrips.loyaltyPoints': 'Pointi za Uaminifu',
    'myTrips.upcomingTab': 'Zinazokuja',
    'myTrips.pastTab': 'Zilizopita',
    'myTrips.savedTab': 'Zilizohifadhiwa',
    
    // Cart
    'cart.title': 'Kikapu Chako',
    'cart.subtitle': 'Kagua na uweke nafasi kila kitu kwa mara moja',
    'cart.empty': 'Kikapu chako kipo tupu',
    'cart.emptyDesc': 'Ongeza makazi, safari na huduma kwenye kikapu chako',
    'cart.startPlanning': 'Anza Kupanga',
    'cart.items': 'Vitu vya Kikapu',
    'cart.orderSummary': 'Muhtasari wa Agizo',
    'cart.subtotal': 'Jumla Ndogo',
    'cart.discount': 'Punguzo',
    'cart.total': 'Jumla',
    'cart.checkout': 'Endelea na Malipo',
    'cart.remove': 'Ondoa',
    'cart.clearAll': 'Futa Yote',
    
    // Wishlist
    'wishlist.title': 'Orodha Yangu ya Matakwa',
    'wishlist.subtitle': 'Vitu vyako vilivyohifadhiwa',
    'wishlist.empty': 'Orodha yako ya matakwa ipo tupu',
    'wishlist.emptyDesc': 'Anza kuongeza vitu kwenye orodha yako',
    'wishlist.explore': 'Gundua',
    'wishlist.addToCart': 'Ongeza kwenye Kikapu',
    
    // Common
    'common.loading': 'Inapakia...',
    'common.error': 'Hitilafu',
    'common.success': 'Imefanikiwa',
    'common.cancel': 'Ghairi',
    'common.confirm': 'Thibitisha',
    'common.save': 'Hifadhi',
    'common.delete': 'Futa',
    'common.edit': 'Hariri',
    
    // Hero Section
    'hero.title': 'Kuendeleza Mafanikio kwa Wamiliki wa Mali na Biashara za Utalii',
    'hero.tagline': 'Suluhisho za Masoko na Usimamizi zilizobinafsishwa kwa mahitaji yako ya biashara nchini Rwanda',
    
    // Services Section
    'services.salesMarketing': 'Mauzo na Masoko',
    'services.salesDesc': 'Ukuaji wa Mapato',
    'services.management': 'Usimamizi',
    'services.managementDesc': 'Mali na Shughuli',
    'services.marketInsights': 'Maarifa ya Soko',
    'services.marketInsightsDesc': 'Data na Uchambuzi',
    'services.crmLeads': 'CRM na Wateja',
    'services.crmLeadsDesc': 'Uzalishaji wa Wateja',
    'services.aiConcierge': 'Msaidizi wa AI',
    'services.aiConciergeDesc': 'Niulize chochote!',
    
    // About Section
    'about.title': 'Mshirika Wako katika Ukuaji wa Biashara',
    'about.description': 'Katika Merry360Global, tunafanya kazi ya kutoa suluhisho kamili za masoko na usimamizi zilizobinafsishwa kwa sekta za mali na utalii nchini Rwanda. Dhamira yetu ni kuendeleza ukuaji endelevu kwa wamiliki wa mali na biashara za utalii kupitia mikakati ya ubunifu, maarifa yanayotegemea data, na utoaji wa huduma bora.',
    'about.propertiesManaged': 'Mali Zilizosimamia',
    'about.customersServed': 'Wateja Waliotumikiwa',
    
    // Accommodation Details
    'accommodation.details': 'Maelezo',
    'accommodation.amenities': 'Vifaa',
    'accommodation.reviews': 'Maoni',
    'accommodation.location': 'Eneo',
    'accommodation.host': 'Mwenyeji Wako',
    'accommodation.getDirections': 'Pata Mwelekeo',
    'accommodation.addToCart': 'Ongeza kwenye Kikapu',
    'accommodation.reserveNow': 'Weka Nafasi Sasa',
    'accommodation.perNight': 'kwa usiku',
    'accommodation.guests': 'Wageni',
    'accommodation.bedrooms': 'Vyumba vya Kulala',
    'accommodation.bathrooms': 'Vyumba vya Kuoga',
    'accommodation.checkAvailability': 'Angalia Upatikanaji',
    'accommodation.entirePlace': 'Mahali pote',
    'accommodation.privateRoom': 'Chumba cha kibinafsi',
    'accommodation.sharedRoom': 'Chumba cha pamoja',
    
    // Stories
    'stories.title': 'Hadithi za Wageni',
    'stories.subtitle': 'Uzoefu kutoka jumuiya yetu',
    'stories.viewStory': 'Tazama Hadithi',
    'stories.noStories': 'Hakuna hadithi bado',
    'stories.shareYourStory': 'Shiriki Hadithi Yako',
    
    // Checkout
    'checkout.title': 'Kamilisha Uhifadhi Wako',
    'checkout.bookingSummary': 'Muhtasari wa Uhifadhi',
    'checkout.guestDetails': 'Maelezo ya Mgeni',
    'checkout.paymentMethod': 'Njia ya Malipo',
    'checkout.cardPayment': 'Kadi ya Mkopo/Ukulimu',
    'checkout.mobileMoney': 'Mobile Money',
    'checkout.crypto': 'Cryptocurrency',
    'checkout.fullName': 'Jina Kamili',
    'checkout.email': 'Barua Pepe',
    'checkout.phone': 'Nambari ya Simu',
    'checkout.specialRequests': 'Maombi Maalum',
    'checkout.priceBreakdown': 'Maelezo ya Bei',
    'checkout.nightlyRate': 'Bei kwa Usiku',
    'checkout.nights': 'usiku',
    'checkout.serviceFee': 'Ada ya Huduma',
    'checkout.taxes': 'Kodi na Ada',
    'checkout.totalPrice': 'Bei Jumla',
    'checkout.confirmBooking': 'Thibitisha Uhifadhi',
    
    // Dashboard
    'dashboard.welcome': 'Karibu tena',
    'dashboard.upcomingTrips': 'Safari Zinazokuja',
    'dashboard.recentActivity': 'Shughuli za Hivi Karibuni',
    'dashboard.savedItems': 'Vitu Vilivyohifadhiwa',
    'dashboard.accountSettings': 'Mipangilio ya Akaunti',
    
    // Auth
    'auth.login': 'Ingia',
    'auth.signup': 'Jisajili',
    'auth.logout': 'Toka',
    'auth.forgotPassword': 'Umesahau Nywila',
    'auth.email': 'Barua Pepe',
    'auth.password': 'Nywila',
    'auth.confirmPassword': 'Thibitisha Nywila',
    'auth.rememberMe': 'Nikumbuke',
    'auth.dontHaveAccount': 'Hauna akaunti?',
    'auth.alreadyHaveAccount': 'Una akaunti tayari?',
  }
}

export function useTranslation() {
  const languageStore = useLanguageStore()
  
  const currentLanguage = computed(() => languageStore.currentLanguage)
  
  const t = (key) => {
    const lang = currentLanguage.value
    return translations[lang]?.[key] || translations.EN[key] || key
  }
  
  return {
    t,
    currentLanguage
  }
}
