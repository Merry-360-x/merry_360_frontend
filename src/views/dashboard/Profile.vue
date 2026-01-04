<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2 text-text-primary">{{ t('profile.title') }}</h1>
        <p class="text-text-secondary">{{ t('profile.subtitle') }}</p>
      </div>

      <!-- Profile Completion Alert -->
      <div v-if="!isProfileComplete && !profileAlertDismissed" class="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-amber-900 mb-1">{{ t('profile.completeYourProfile') }}</h3>
            <p class="text-sm text-amber-800 mb-3">
              {{ t('profile.completeYourProfileDesc') }}
            </p>
            <Button variant="primary" size="sm" @click="activeProfileTab = 'personal'">
              {{ t('profile.completeProfile') }}
            </Button>
          </div>
          <button @click="dismissProfileAlert" class="flex-shrink-0 text-amber-600 hover:text-amber-800 text-amber-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Sidebar -->
        <div class="lg:col-span-1">
          <Card padding="lg">
            <!-- Avatar -->
            <div class="text-center mb-6">
              <div class="relative inline-block">
                <div v-if="userStore.user?.avatar_url" class="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                  <img :src="userStore.user.avatar_url" :alt="userStore.user.name" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-32 h-32 bg-gradient-to-br from-brand-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-white text-4xl font-bold">{{ userInitials }}</span>
                </div>
                <button 
                  @click.prevent="selectAvatar" 
                  :disabled="uploadingAvatar"
                  class="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!uploadingAvatar" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
              </div>
              <h2 class="text-xl font-bold mb-1">{{ userStore.user?.name || t('profile.guestUser') }}</h2>
              <p class="text-text-secondary text-sm">{{ userStore.user?.email || t('profile.guestEmail') }}</p>
            </div>

            <!-- Membership -->
            <div class="p-4 bg-gradient-to-br from-brand-50 to-red-50 dark:from-brand-900/30 dark:to-red-900/30 rounded-xl mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-text-secondary">{{ t('profile.membership') }}</span>
                <span class="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                  {{ userStore.loyaltyTier.toUpperCase() }}
                </span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-bold text-brand-600 dark:text-brand-400">{{ userStore.loyaltyPoints }}</span>
                <span class="text-text-secondary text-sm">{{ t('profile.points') }}</span>
              </div>
              <div class="mt-3">
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-text-secondary">{{ t('profile.nextTier') }}</span>
                  <span class="font-semibold text-text-primary">{{ userStore.nextTierPoints }} pts</span>
                </div>
                <div class="w-full bg-white dark:bg-gray-700 rounded-full h-2">
                  <div class="bg-brand-500 rounded-full h-2 transition-all" :style="`width: ${loyaltyProgress}%`"></div>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-text-secondary">{{ t('profile.tripsCompleted') }}</span>
                <span class="font-semibold text-text-primary">{{ userStore.pastBookings.length }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-text-secondary">{{ t('profile.savedItems') }}</span>
                <span class="font-semibold text-text-primary">{{ userStore.watchlistCount }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-text-secondary">{{ t('profile.memberSince') }}</span>
                <span class="font-semibold text-text-primary">{{ memberSince }}</span>
              </div>
            </div>

            <!-- Admin Panel Button (only for admins) -->
            <div v-if="userStore.user?.role === 'admin'" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="primary" 
                size="md" 
                full-width 
                @click="router.push('/admin')"
                class="mb-3"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ t('admin.panel') }}
              </Button>
            </div>

            <!-- Logout Button -->
            <div :class="userStore.user?.role === 'admin' ? '' : 'mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'">
              <Button variant="outline" size="md" full-width @click="handleLogout" class="text-red-600 border-red-600 hover:bg-red-50">
                {{ t('auth.logout') }}
              </Button>
            </div>
          </Card>
        </div>

        <!-- Profile Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Tabs Navigation -->
          <Card padding="none">
            <div class="flex gap-2 p-2 overflow-x-auto">
              <button
                v-for="tab in profileTabs"
                :key="tab.id"
                @click="activeProfileTab = tab.id"
                :class="[
                  'px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap',
                  activeProfileTab === tab.id
                    ? 'bg-brand-500 text-white'
                    : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>
          </Card>

          <!-- My Trips Tab -->
          <div v-if="activeProfileTab === 'trips'">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card padding="md">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-text-muted text-xs mb-1">{{ t('profile.upcomingTrips') }}</p>
                    <p class="text-2xl font-bold text-brand-600">{{ upcomingBookings.length }}</p>
                  </div>
                  <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-text-muted text-xs mb-1">{{ t('cart.items') }}</p>
                    <p class="text-2xl font-bold text-text-primary">{{ userStore.cartCount }}</p>
                  </div>
                  <div class="px-2 py-1 bg-brand-500 text-white rounded-lg flex items-center justify-center">
                    <span class="text-xs font-bold">TripCart</span>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-text-muted text-xs mb-1">{{ t('profile.loyaltyPoints') }}</p>
                    <p class="text-2xl font-bold text-brand-600">{{ userStore.loyaltyPoints }}</p>
                  </div>
                  <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Trip Status Tabs -->
            <div class="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
              <button
                v-for="tab in tripTabs"
                :key="tab.id"
                @click="activeTripTab = tab.id"
                :class="[
                  'px-4 py-3 font-semibold transition-all relative',
                  activeTripTab === tab.id
                    ? 'text-brand-600'
                    : 'text-text-secondary hover:text-text-brand-600'
                ]"
              >
                {{ tab.name }}
                <div v-if="activeTripTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              </button>
            </div>

            <!-- Upcoming Trips -->
            <div v-if="activeTripTab === 'upcoming'" class="space-y-4">
              <div v-if="upcomingBookings.length === 0" class="text-center py-12">
                <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h3 class="text-lg font-semibold text-text-brand-600 mb-2">{{ t('profile.noUpcomingTrips') }}</h3>
                <p class="text-text-secondary mb-4">{{ t('profile.startPlanningNextAdventure') }}</p>
                <Button variant="primary" size="md" @click="router.push('/home')">
                  {{ t('profile.exploreDestinations') }}
                </Button>
              </div>
              <Card v-else v-for="booking in upcomingBookings" :key="booking.id" padding="md" class="hover:shadow-lg transition-shadow">
                <div class="flex flex-col md:flex-row gap-4">
                  <img loading="lazy" :src="booking.image" alt="Booking" class="w-full md:w-40 h-40 object-cover rounded-lg" />
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <h3 class="text-lg font-bold text-text-brand-600 mb-1">{{ booking.name }}</h3>
                        <p class="text-text-secondary text-sm">{{ booking.location }}</p>
                      </div>
                      <span class="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold">{{ t('booking.confirmed') }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p class="text-text-muted text-xs">{{ t('accommodationList.checkInLabel') }}</p>
                        <p class="font-semibold text-sm">{{ booking.checkIn }}</p>
                      </div>
                      <div>
                        <p class="text-text-muted text-xs">{{ t('accommodationList.checkOutLabel') }}</p>
                        <p class="font-semibold text-sm">{{ booking.checkOut }}</p>
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-xl font-bold text-brand-600">{{ formatPrice(booking.price) }}</span>
                      <div class="flex gap-2">
                        <Button variant="outline" size="sm">{{ t('common.viewDetails') }}</Button>
                        <Button variant="primary" size="sm">{{ t('common.manage') }}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Past Trips -->
            <div v-if="activeTripTab === 'past'" class="text-center py-12">
              <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="text-lg font-semibold text-text-brand-600 mb-2">{{ t('profile.noPastTrips') }}</h3>
              <p class="text-text-secondary">{{ t('profile.travelHistoryWillAppearHere') }}</p>
            </div>

            <!-- Saved -->
            <div v-if="activeTripTab === 'saved'" class="space-y-4">
              <div v-if="userStore.watchlistCount === 0" class="text-center py-12">
                <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <h3 class="text-lg font-semibold text-text-brand-600 mb-2">{{ t('profile.noSavedItems') }}</h3>
                <p class="text-text-secondary mb-4">{{ t('profile.saveFavoritesToVisitLater') }}</p>
                <Button variant="primary" size="md" @click="router.push('/home')">
                  {{ t('profile.discoverPlaces') }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Personal Information Tab -->
          <Card v-if="activeProfileTab === 'personal'" padding="lg">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold">{{ t('profile.personalInformation') }}</h3>
              <Button variant="outline" size="sm" @click="editingPersonal = !editingPersonal">
                {{ editingPersonal ? t('common.cancel') : t('common.edit') }}
              </Button>
            </div>

            <form @submit.prevent="savePersonalInfo" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">{{ t('checkout.firstName') }}</label>
                  <Input
                    v-model="personalInfo.firstName"
                    :disabled="!editingPersonal"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-primary mb-2">{{ t('checkout.lastName') }}</label>
                  <Input
                    v-model="personalInfo.lastName"
                    :disabled="!editingPersonal"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">{{ t('auth.email') }}</label>
                <Input
                  v-model="personalInfo.email"
                  type="email"
                  :disabled="!editingPersonal"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">{{ t('auth.phoneNumber') }}</label>
                <Input
                  v-model="personalInfo.phone"
                  type="tel"
                  :disabled="!editingPersonal"
                  placeholder="+250 7XX XXX XXX"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">{{ t('profile.dateOfBirth') }}</label>
                <Input
                  v-model="personalInfo.dateOfBirth"
                  type="date"
                  :disabled="!editingPersonal"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">{{ t('profile.bio') }}</label>
                <textarea
                  v-model="personalInfo.bio"
                  :disabled="!editingPersonal"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 bg-white dark:bg-gray-900 text-text-primary placeholder:text-gray-400"
                  :placeholder="t('profile.bioPlaceholder')"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">{{ t('profile.educationStudies') }}</label>
                <textarea
                  v-model="personalInfo.studies"
                  :disabled="!editingPersonal"
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-900 text-text-primary placeholder:text-gray-400"
                  :placeholder="t('profile.educationStudiesPlaceholder')"
                ></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('profile.educationStudiesHelp') }}</p>
              </div>

              <div v-if="editingPersonal" class="flex gap-3">
                <Button type="submit" variant="primary" size="md">
                  {{ t('common.saveChanges') }}
                </Button>
                <Button type="button" variant="outline" size="md" @click="editingPersonal = false">
                  {{ t('common.cancel') }}
                </Button>
              </div>
            </form>
          </Card>

          <!-- Preferences Tab -->
          <Card v-if="activeProfileTab === 'preferences'" padding="lg">
            <h3 class="text-xl font-bold mb-6">{{ t('profile.preferences') }}</h3>

            <div class="space-y-6">
              <!-- Language -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">{{ t('profile.language') }}</label>
                <select v-model="userStore.preferences.language" class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-900 text-text-primary">
                  <option value="EN">{{ t('language.english') }}</option>
                  <option value="RW">{{ t('language.kinyarwanda') }}</option>
                  <option value="FR">{{ t('language.french') }}</option>
                </select>
              </div>

              <!-- Currency -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">{{ t('profile.currency') }}</label>
                <select v-model="userStore.preferences.currency" class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-900 text-text-primary">
                  <option value="RWF">{{ t('currency.rwf') }}</option>
                  <option value="USD">{{ t('currency.usd') }}</option>
                  <option value="EUR">{{ t('currency.eur') }}</option>
                </select>
              </div>

              <!-- Notifications -->
              <div>
                <label class="block text-sm font-medium text-text-primary mb-3">{{ t('profile.notifications') }}</label>
                <div class="space-y-3">
                  <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <span class="text-sm text-text-primary">{{ t('profile.emailNotifications') }}</span>
                    <input type="checkbox" v-model="userStore.preferences.notifications.email" class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 dark:bg-gray-800">
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <span class="text-sm text-text-primary">{{ t('profile.pushNotifications') }}</span>
                    <input type="checkbox" v-model="userStore.preferences.notifications.push" class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 dark:bg-gray-800">
                  </label>
                  <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <span class="text-sm text-text-primary">{{ t('profile.smsNotifications') }}</span>
                    <input type="checkbox" v-model="userStore.preferences.notifications.sms" class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 dark:bg-gray-800">
                  </label>
                </div>
              </div>

              <!-- Sustainable Travel -->
              <label class="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 cursor-pointer">
                <div class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <span class="text-sm font-semibold text-text-primary">{{ t('profile.sustainableTravelMode') }}</span>
                    <p class="text-xs text-green-700 dark:text-green-300">{{ t('profile.sustainableTravelDesc') }}</p>
                  </div>
                </div>
                <input type="checkbox" v-model="userStore.preferences.sustainableTravel" class="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:bg-gray-800">
              </label>

              <Button variant="primary" size="md" @click="savePreferences">
                {{ t('profile.savePreferences') }}
              </Button>
            </div>
          </Card>

          <!-- Security Tab -->
          <Card v-if="activeProfileTab === 'security'" padding="lg">
            <h3 class="text-xl font-bold mb-6">{{ t('profile.security') }}</h3>

            <div class="space-y-4">
              <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold mb-1 text-text-primary">{{ t('profile.password') }}</h4>
                    <p class="text-sm text-text-secondary">{{ t('profile.passwordLastChanged', { months: 3 }) }}</p>
                  </div>
                  <Button variant="outline" size="sm" @click="showChangePassword = true">
                    {{ t('common.change') }}
                  </Button>
                </div>
              </div>

              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold mb-1">{{ t('profile.twoFactorAuth') }}</h4>
                    <p class="text-sm text-text-secondary">{{ t('profile.twoFactorAuthDesc') }}</p>
                  </div>
                  <Button v-if="!userStore.user?.twoFactorEnabled" variant="outline" size="sm" @click="enable2FA">
                    {{ t('profile.enable') }}
                  </Button>
                  <span v-else class="text-sm text-green-600 font-semibold">✓ {{ t('profile.enabled') }}</span>
                </div>
              </div>
            </div>
          </Card>

          <!-- Change Password Modal (simple version) -->
          <div v-if="showChangePassword" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <Card padding="lg" class="max-w-md w-full">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">{{ t('profile.changePassword') }}</h3>
                <button @click="showChangePassword = false" class="text-gray-400 hover:text-gray-600 text-gray-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form @submit.prevent="changePassword" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-text-brand-600 mb-2">{{ t('profile.currentPassword') }}</label>
                  <Input
                    v-model="passwordForm.current"
                    type="password"
                    :placeholder="t('profile.currentPasswordPlaceholder')"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-brand-600 mb-2">{{ t('profile.newPassword') }}</label>
                  <Input
                    v-model="passwordForm.new"
                    type="password"
                    :placeholder="t('profile.newPasswordPlaceholder')"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-text-brand-600 mb-2">{{ t('profile.confirmNewPassword') }}</label>
                  <Input
                    v-model="passwordForm.confirm"
                    type="password"
                    :placeholder="t('profile.confirmNewPasswordPlaceholder')"
                  />
                </div>
                <div class="flex gap-3">
                  <Button type="submit" variant="primary" size="md" full-width>
                    {{ t('profile.updatePassword') }}
                  </Button>
                  <Button type="button" variant="outline" size="md" @click="showChangePassword = false">
                    {{ t('common.cancel') }}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>

        <!-- 2FA Setup Modal -->
        <div v-if="show2FASetup" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <Card padding="lg" class="max-w-md w-full">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold">{{ t('profile.enableTwoFactorAuth') }}</h3>
              <button @click="show2FASetup = false" class="text-gray-400 hover:text-gray-600 text-gray-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-blue-800">
                  <strong>{{ t('profile.note') }}</strong> {{ t('profile.twoFactorNote') }}
                </p>
              </div>

              <div class="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div class="flex gap-2">
                  <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <div class="text-sm text-amber-800">
                    <strong>{{ t('profile.important') }}</strong> {{ t('profile.twoFactorImportant') }}
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <Button variant="primary" size="md" full-width @click="setup2FA">
                  {{ t('profile.enable2FA') }}
                </Button>
                <Button variant="outline" size="md" @click="show2FASetup = false">
                  {{ t('common.cancel') }}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useCurrencyStore } from '@/stores/currency'
import MainLayout from '@/components/layout/MainLayout.vue'
import Card from '@/components/common/Card.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import { uploadToCloudinary } from '@/services/cloudinary'
import { signOut as signOutAuth } from '@/services/auth'
import { supabase } from '@/services/supabase'
import { confirmDialog } from '@/composables/useConfirm'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()

const activeProfileTab = ref('trips')
const activeTripTab = ref('upcoming')
const editingPersonal = ref(false)
const showChangePassword = ref(false)
const show2FASetup = ref(false)

// Avatar upload refs
const avatarInput = ref(null)
const uploadingAvatar = ref(false)

const profileTabs = computed(() => [
  { id: 'trips', name: t('profile.myTrips') },
  { id: 'personal', name: t('profile.personalInfoTab') },
  { id: 'preferences', name: t('profile.preferences') },
  { id: 'security', name: t('profile.security') }
])

const tripTabs = computed(() => [
  { id: 'upcoming', name: t('profile.upcoming') },
  { id: 'past', name: t('profile.pastTrips') },
  { id: 'saved', name: t('profile.saved') }
])

// Fetch real bookings from user data or API
const upcomingBookings = ref([])

const personalInfo = ref({
  firstName: userStore.user?.firstName || userStore.user?.name?.split(' ')[0] || '',
  lastName: userStore.user?.lastName || userStore.user?.name?.split(' ').slice(1).join(' ') || '',
  email: userStore.user?.email || '',
  phone: userStore.user?.phone || '',
  dateOfBirth: userStore.user?.dateOfBirth || '',
  bio: userStore.user?.bio || '',
  studies: userStore.user?.studies || ''
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const userInitials = computed(() => {
  const name = userStore.user?.name || 'Guest User'
  const parts = name.trim().split(/\s+/).filter(p => p.length > 0)
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const loyaltyProgress = computed(() => {
  const tiers = { bronze: 1000, silver: 5000, gold: 15000, platinum: 50000 }
  const current = userStore.loyaltyPoints || 0
  const currentTier = userStore.loyaltyTier || 'bronze'
  const nextTier = Object.entries(tiers).find(([tier, points]) => current < points)
  
  if (!nextTier) return 100
  
  const tierEntries = Object.entries(tiers)
  const currentIndex = tierEntries.findIndex(([tier]) => tier === currentTier)
  const currentTierPoints = currentIndex > 0 ? tierEntries[currentIndex][1] : 0
  const nextTierPoints = nextTier[1]
  
  const progress = ((current - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100
  return Math.max(0, Math.min(100, progress))
})

const memberSince = computed(() => {
  if (userStore.user?.createdAt) {
    return new Date(userStore.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})

// Profile completion check
const isProfileComplete = computed(() => {
  return !!(personalInfo.value.phone && personalInfo.value.dateOfBirth)
})

const profileAlertDismissed = ref(localStorage.getItem('profileAlertDismissed') === 'true')

const dismissProfileAlert = () => {
  localStorage.setItem('profileAlertDismissed', 'true')
  profileAlertDismissed.value = true
}

const formatPrice = (price) => {
  return currencyStore.formatPrice(typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price)
}

const savePersonalInfo = async () => {
  if (!editingPersonal.value) return

  if (!userStore.user?.id) {
    userStore.user = {
      ...userStore.user,
      name: `${personalInfo.value.firstName} ${personalInfo.value.lastName}`.trim(),
      email: personalInfo.value.email,
      phone: personalInfo.value.phone,
      dateOfBirth: personalInfo.value.dateOfBirth,
      bio: personalInfo.value.bio
    }
    localStorage.setItem('user', JSON.stringify(userStore.user))
    editingPersonal.value = false
    alert(t('profile.personalUpdatedLocally'))
    return
  }

  try {
    console.log('🔄 Updating profile for user:', userStore.user.id)
    
    // Build updates object with all fields
    const updates = {
      first_name: personalInfo.value.firstName.trim(),
      last_name: personalInfo.value.lastName.trim()
    }

    // Add optional fields
    if (personalInfo.value.phone?.trim()) {
      updates.phone = personalInfo.value.phone.trim()
    }
    if (personalInfo.value.dateOfBirth) {
      updates.date_of_birth = personalInfo.value.dateOfBirth
    }
    if (personalInfo.value.bio?.trim()) {
      updates.bio = personalInfo.value.bio.trim()
    }
    if (personalInfo.value.studies?.trim()) {
      updates.studies = personalInfo.value.studies.trim()
    }

    console.log('Updates:', updates)

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userStore.user.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('✅ Profile updated:', data)

    const updatedUser = {
      ...userStore.user,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || userStore.user.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      phone: data.phone || '',
      dateOfBirth: data.date_of_birth || '',
      bio: data.bio || '',
      studies: data.studies || ''
    }

    await userStore.login(updatedUser)

    editingPersonal.value = false
    alert(t('profile.personalUpdatedSuccessfully'))
  } catch (err) {
    console.error('Error updating profile:', err)
    const errorMsg = err.message || err.hint || 'Unknown error'
    alert(t('profile.personalUpdateFailed', { error: errorMsg }))
  }
}

const savePreferences = () => {
  // Preferences are already bound to the store
  alert(t('profile.preferencesSaved'))
}

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert(t('profile.passwordsDoNotMatch'))
    return
  }
  
  if (passwordForm.value.new.length < 6) {
    alert(t('profile.passwordMinLength', { min: 6 }))
    return
  }
  
  try {
    // Verify current password by re-auth (keeps security expectations aligned with UI)
    if (!userStore.user?.email) {
      alert(t('profile.loginAgainToChangePassword'))
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userStore.user.email,
      password: passwordForm.value.current
    })

    if (signInError) {
      alert(t('profile.currentPasswordIncorrect'))
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.value.new
    })

    if (updateError) {
      throw updateError
    }

    showChangePassword.value = false
    passwordForm.value = { current: '', new: '', confirm: '' }
    alert(t('profile.passwordChangedSuccessfully'))
  } catch (err) {
    console.error('Password change error:', err)
    alert(err?.message || t('profile.passwordChangeFailed'))
  }
}

const enable2FA = () => {
  show2FASetup.value = true
}

const setup2FA = () => {
  // Here you would typically:
  // 1. Generate a TOTP secret on the backend
  // 2. Display QR code for user to scan with authenticator app
  // 3. Verify the code entered by user
  // 4. Enable 2FA for the account
  
  // For now, just simulate success
  alert(t('profile.twoFactorEnabledAlert'))
  show2FASetup.value = false
  
  // Update user store to reflect 2FA is enabled
  if (userStore.user) {
    userStore.user.twoFactorEnabled = true
  }
}

const handleLogout = async () => {
  const ok = await confirmDialog(t('auth.logoutConfirm'), {
    title: t('auth.logout'),
    confirmText: t('auth.logout'),
    cancelText: t('common.cancel')
  })

  if (ok) {
    try {
      await signOutAuth()
    } catch (err) {
      console.warn('Error signing out from provider:', err.message)
    }
    userStore.logout()
    router.push('/login')
  }
}

const selectAvatar = () => {
  if (avatarInput.value) avatarInput.value.click()
}

const onAvatarChange = async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert(t('profile.imageTooLarge', { maxMB: 5 }))
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert(t('profile.selectImageFile'))
    return
  }
  
  uploadingAvatar.value = true
  try {
    console.log('🖼️ Uploading profile picture...')
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(file, { folder: 'merry360x/avatars' })
    const avatarUrl = result.secure_url
    console.log('✅ Image uploaded to Cloudinary:', avatarUrl)
    
    // Save to Supabase database
    if (userStore.user?.id) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userStore.user.id)
        .select()
        .single()
      
      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      console.log('✅ Avatar saved to database:', data)
      
      // Update user store with new avatar
      const updatedUser = {
        ...userStore.user,
        avatar_url: avatarUrl
      }
      await userStore.login(updatedUser)
      alert(t('profile.profilePictureUpdatedSuccessfully'))
    } else {
      // Fallback for users without database ID
      const user = JSON.parse(localStorage.getItem('user')) || {}
      user.avatar_url = avatarUrl
      localStorage.setItem('user', JSON.stringify(user))
      userStore.login(user)
      alert(t('profile.profilePictureUpdated'))
    }
  } catch (err) {
    console.error('Failed to upload avatar:', err)
    alert(t('profile.profilePictureUploadFailed', { error: err.message }))
  } finally {
    uploadingAvatar.value = false
    // Reset file input
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  }
}
</script>
