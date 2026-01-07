<template>
  <MainLayout>
    <!-- Hero with Search -->
    <section class="relative h-[70vh]">
      <!-- Video Background -->
      <div class="absolute inset-0 overflow-hidden">
        <video 
          autoplay 
          muted 
          loop 
          playsinline 
          class="w-full h-full object-cover"
        >
          <source src="/videos/Merry.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
      </div>

      <!-- Content -->
      <div class="relative h-full flex flex-col items-center justify-center px-4">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center mb-12 max-w-4xl">
          {{ t('home.findProperty') }}
        </h1>

        <!-- Desktop Search -->
        <div class="hidden md:block w-full max-w-4xl relative">
          <div
            ref="searchBarContainer"
            class="hero-search-bar relative bg-white dark:bg-gray-800 rounded-full transition-all duration-300 will-change-transform"
            :class="[
              activePanel ? 'z-40' : 'z-10',
              isHeroScrolled ? 'shadow-xl -translate-y-0.5 scale-[0.99]' : 'shadow-2xl translate-y-0 scale-100'
            ]"
          >
            <div class="flex items-stretch">
              <button @click.stop="openPanel('where')" class="flex-1 text-left px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all rounded-l-full" :class="activePanel === 'where' ? 'bg-gray-50 dark:bg-gray-900' : ''">
                <div class="text-xs font-bold text-gray-600 dark:text-gray-400">Where</div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ searchQuery.location || 'Search destinations' }}</div>
              </button>
              <div class="w-px my-4 bg-gray-200 dark:bg-gray-700"></div>
              <button @click.stop="openPanel('when')" class="flex-1 text-left px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all" :class="activePanel === 'when' ? 'bg-gray-50 dark:bg-gray-900' : ''">
                <div class="text-xs font-bold text-gray-600 dark:text-gray-400">When</div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ dateSummary }}</div>
              </button>
              <div class="w-px my-4 bg-gray-200 dark:bg-gray-700"></div>
              <button @click.stop="openPanel('who')" class="flex-1 text-left px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all rounded-r-full" :class="activePanel === 'who' ? 'bg-gray-50 dark:bg-gray-900' : ''">
                <div class="text-xs font-bold text-gray-600 dark:text-gray-400">Who</div>
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ guestSummary || 'Add guests' }}</div>
              </button>
              <button @click="onDesktopPrimary" class="m-2 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-all shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Desktop Search Overlays (positioned absolutely below search bar) -->
          <Transition name="fade">
            <div v-if="activePanel" class="fixed inset-0 z-30 bg-black/20" @click="closeDesktopPanel"></div>
          </Transition>
          
          <Transition name="dropdown">
            <div v-if="activePanel" class="absolute z-40 mt-5" :class="dropdownClass" @click.stop>
              <!-- Where Panel -->
              <div v-if="activePanel === 'where'" class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden w-full">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
              <input ref="whereInput" v-model="searchQuery.location" type="text" placeholder="Search destinations" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium" @keydown.down.prevent="highlightNextWhereSuggestion" @keydown.up.prevent="highlightPrevWhereSuggestion" @keydown.enter.prevent="applyHighlightedWhereSuggestion" />
            </div>
            <div class="max-h-[400px] overflow-auto">
              <div class="p-2">
                <div class="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Suggested destinations</div>
                <button v-for="(item, idx) in whereSuggestions" :key="item.value" type="button" class="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors" :class="idx === highlightedWhereIndex ? 'bg-gray-50 dark:bg-gray-900' : ''" @mousedown.prevent="selectWhereSuggestion(item)">
                  <div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div class="flex-1"><div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ item.title }}</div><div v-if="item.subtitle" class="text-xs text-gray-500 dark:text-gray-400">{{ item.subtitle }}</div></div>
                </button>
              </div>
            </div>
          </div>

          <!-- When Panel -->
          <div v-else-if="activePanel === 'when'" class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden w-full">
            <div class="p-6">
              <div class="flex items-center justify-between gap-4 mb-6">
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="px-6 py-2 text-sm font-semibold rounded-full transition-colors"
                    :class="whenMode === 'dates'
                      ? 'bg-white dark:bg-gray-700 border-2 border-gray-900 dark:border-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'"
                    @click="setWhenMode('dates')"
                  >
                    Dates
                  </button>
                  <button
                    type="button"
                    class="px-6 py-2 text-sm font-semibold rounded-full transition-colors"
                    :class="whenMode === 'months'
                      ? 'bg-white dark:bg-gray-700 border-2 border-gray-900 dark:border-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'"
                    @click="setWhenMode('months')"
                  >
                    Months
                  </button>
                  <button
                    type="button"
                    class="px-6 py-2 text-sm font-semibold rounded-full transition-colors"
                    :class="whenMode === 'flexible'
                      ? 'bg-white dark:bg-gray-700 border-2 border-gray-900 dark:border-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'"
                    @click="setWhenMode('flexible')"
                  >
                    Flexible
                  </button>
                </div>
                <button type="button" class="text-sm font-semibold underline text-gray-700 dark:text-gray-300" @click="clearDates">Clear dates</button>
              </div>

              <!-- Dates mode -->
              <div v-if="whenMode === 'dates'" class="grid grid-cols-2 gap-12">
                <div v-for="month in calendarMonths" :key="month.key">
                  <div class="flex items-center justify-between mb-4">
                    <button v-if="month.nav === 'prev'" type="button" class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors" @click="goPrevMonth"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
                    <div v-else class="w-8"></div>
                    <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ month.label }}</div>
                    <button v-if="month.nav === 'next'" type="button" class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors" @click="goNextMonth"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
                    <div v-else class="w-8"></div>
                  </div>
                  <div class="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2"><div v-for="d in weekDays" :key="d" class="text-center h-8 flex items-center justify-center">{{ d }}</div></div>
                  <div class="grid grid-cols-7 gap-1"><button v-for="day in month.days" :key="day.key" type="button" class="h-11 rounded-lg text-sm font-semibold transition-all" :class="dayClass(day)" :disabled="!day.iso || day.isPast" @click="onPickDate(day.iso)">{{ day.dayNumber || '' }}</button></div>
                </div>
              </div>

              <div v-if="whenMode === 'dates'" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  :class="dateFlexDays === 0
                    ? 'border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-900 dark:hover:border-gray-100'"
                  @click="setDateFlex(0)"
                >
                  Exact dates
                </button>
                <button
                  v-for="n in [1,2,3,4,5]"
                  :key="n"
                  type="button"
                  class="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  :class="dateFlexDays === n
                    ? 'border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-900 dark:hover:border-gray-100'"
                  @click="setDateFlex(n)"
                >
                  ± {{ n }} day{{ n > 1 ? 's' : '' }}
                </button>
              </div>

              <!-- Months mode -->
              <div v-else-if="whenMode === 'months'" class="space-y-4">
                <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Select a month</div>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="m in monthOptions"
                    :key="m.value"
                    type="button"
                    class="px-4 py-3 rounded-2xl text-left transition-colors"
                    :class="selectedMonth === m.value
                      ? 'bg-gray-100 dark:bg-gray-900 border-2 border-gray-900 dark:border-gray-100'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'"
                    @click="selectMonth(m.value)"
                  >
                    <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ m.short }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">{{ m.year }}</div>
                  </button>
                </div>
                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button type="button" class="text-sm font-semibold underline text-gray-700 dark:text-gray-300" @click="clearMonth">Clear month</button>
                </div>
              </div>

              <!-- Flexible mode -->
              <div v-else class="space-y-4">
                <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">How flexible are you?</div>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="opt in flexibleOptions"
                    :key="opt.value"
                    type="button"
                    class="px-4 py-3 rounded-2xl text-left transition-colors"
                    :class="flexibleType === opt.value
                      ? 'bg-gray-100 dark:bg-gray-900 border-2 border-gray-900 dark:border-gray-100'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'"
                    @click="selectFlexible(opt.value)"
                  >
                    <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ opt.label }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">{{ opt.sub }}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Who Panel -->
          <div v-else class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden w-full">
            <div class="p-6 space-y-6">
              <div class="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                <div><div class="font-semibold text-gray-900 dark:text-gray-100">Adults</div><div class="text-sm text-gray-500 dark:text-gray-400">Ages 13 or above</div></div>
                <div class="flex items-center gap-4">
                  <button @click="decrementGuests('adults')" :disabled="guestCounts.adults <= 1" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button>
                  <span class="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">{{ guestCounts.adults }}</span>
                  <button @click="incrementGuests('adults')" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                </div>
              </div>
              <div class="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                <div><div class="font-semibold text-gray-900 dark:text-gray-100">Children</div><div class="text-sm text-gray-500 dark:text-gray-400">Ages 2–12</div></div>
                <div class="flex items-center gap-4">
                  <button @click="decrementGuests('children')" :disabled="guestCounts.children <= 0" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button>
                  <span class="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">{{ guestCounts.children }}</span>
                  <button @click="incrementGuests('children')" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                </div>
              </div>
              <div class="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                <div><div class="font-semibold text-gray-900 dark:text-gray-100">Infants</div><div class="text-sm text-gray-500 dark:text-gray-400">Under 2</div></div>
                <div class="flex items-center gap-4">
                  <button @click="decrementGuests('infants')" :disabled="guestCounts.infants <= 0" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button>
                  <span class="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">{{ guestCounts.infants }}</span>
                  <button @click="incrementGuests('infants')" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div><div class="font-semibold text-gray-900 dark:text-gray-100">Pets</div><div class="text-sm text-gray-500 dark:text-gray-400"><button type="button" class="underline hover:text-gray-900 dark:hover:text-gray-100">Bringing a service animal?</button></div></div>
                <div class="flex items-center gap-4">
                  <button @click="decrementGuests('pets')" :disabled="guestCounts.pets <= 0" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button>
                  <span class="w-8 text-center font-semibold text-gray-900 dark:text-gray-100">{{ guestCounts.pets }}</span>
                  <button @click="incrementGuests('pets')" class="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-500 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-100 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end">
                <button type="button" @click="handleSearch" class="px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg">Search</button>
              </div>
            </div>
          </div>
            </div>
          </Transition>
        </div>

        <!-- Mobile Search Button -->
        <div class="md:hidden w-full max-w-md">
          <button @click="openMobile('where')" class="w-full bg-white dark:bg-gray-800 rounded-full shadow-2xl px-6 py-4 text-left">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <div class="flex-1">
                <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ searchQuery.location || 'Where to?' }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{{ dateSummary }} · {{ guestSummary || 'Add guests' }}</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Listings -->
    <section class="bg-white dark:bg-gray-900 py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-end justify-between mb-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ t('home.latestProperties') }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">{{ t('home.browseDesc') }}</p>
            </div>
            <router-link to="/accommodations" class="text-sm font-semibold text-brand-600 hover:text-brand-700">{{ t('home.browseMore') }}</router-link>
          </div>
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <PropertyCardSkeleton v-for="n in 10" :key="n" />
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <PropertyCard v-for="property in latestProperties" :key="property.id" :property="property" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gray-50 dark:bg-gray-900 py-16">
      <div class="container mx-auto px-4">
        <div class="relative overflow-hidden rounded-3xl max-w-6xl mx-auto h-96">
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80" alt="Try Hosting" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
          <div class="relative h-full flex flex-col justify-center p-16 max-w-2xl">
            <h2 class="text-5xl font-bold text-white mb-4">{{ t('home.tryHosting') }}</h2>
            <p class="text-lg text-white/90 mb-8">{{ t('home.tryHostingDesc') }}</p>
            <router-link to="/become-host" class="inline-flex px-8 py-4 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-xl w-max">{{ t('home.tryHosting') }}</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile Search Sheet -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="isMobileSearchOpen" class="fixed inset-0 z-[9999] md:hidden">
          <div class="absolute inset-0 bg-black/40" @click="closeMobile"></div>
          <div
            class="absolute inset-x-0 bg-white dark:bg-gray-900 flex flex-col"
            :class="mobileStep === 'where' || mobileStep === 'when' ? 'bottom-0 h-[85vh] rounded-t-3xl' : 'top-0 bottom-0 rounded-none'"
            @click.stop
          >
            <div class="flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <button @click="closeMobile" class="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              <h3 class="text-base font-bold text-gray-900 dark:text-gray-100">Search</h3>
              <div class="w-10"></div>
            </div>
            <div class="flex-1 overflow-auto p-4">
              <div v-if="mobileStep === 'where'">
                <h4 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Where are you going?</h4>
                <input v-model="searchQuery.location" type="text" placeholder="Search destinations" class="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500" @keydown.enter.prevent="mobileStep = 'when'" />
                <div class="mt-6 space-y-2"><button v-for="item in whereSuggestions" :key="item.value + '-m'" class="w-full text-left px-4 py-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl" @click="selectWhereSuggestion(item); mobileStep = 'when'"><div class="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"><svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div><div class="flex-1"><div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ item.title }}</div><div v-if="item.subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ item.subtitle }}</div></div></button></div>
              </div>
              <div v-else-if="mobileStep === 'when'">
                <h4 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">When's your trip?</h4>
                <div class="mb-4 flex items-center justify-end">
                  <button type="button" class="text-sm font-semibold underline text-gray-700 dark:text-gray-300" @click="clearDates">Clear dates</button>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 space-y-8">
                  <div v-for="month in calendarMonths" :key="month.key + '-m'">
                    <div class="flex items-center justify-between mb-4">
                      <button v-if="month.nav === 'prev'" type="button" class="w-10 h-10 rounded-full hover:bg-white dark:hover:bg-gray-700 flex items-center justify-center" @click="goPrevMonth"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
                      <div class="text-base font-bold text-gray-900 dark:text-gray-100">{{ month.label }}</div>
                      <button v-if="month.nav === 'next'" type="button" class="w-10 h-10 rounded-full hover:bg-white dark:hover:bg-gray-700 flex items-center justify-center" @click="goNextMonth"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
                    </div>
                    <div class="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2"><div v-for="d in weekDays" :key="d + '-m'" class="text-center h-8 flex items-center justify-center">{{ d }}</div></div>
                    <div class="grid grid-cols-7 gap-1"><button v-for="day in month.days" :key="day.key + '-m'" type="button" class="h-11 rounded-lg text-sm font-semibold" :class="dayClass(day)" :disabled="!day.iso || day.isPast" @click="onPickDate(day.iso)">{{ day.dayNumber || '' }}</button></div>
                  </div>
                </div>
              </div>
              <div v-else>
                <h4 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Who's coming?</h4>
                <div class="space-y-6">
                  <div class="flex items-center justify-between py-5 border-b border-gray-200 dark:border-gray-800"><div><div class="font-semibold text-gray-900 dark:text-gray-100">Adults</div><div class="text-sm text-gray-500 dark:text-gray-400">Ages 13+</div></div><div class="flex items-center gap-4"><button @click="decrementGuests('adults')" :disabled="guestCounts.adults <= 1" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg></button><span class="w-10 text-center font-bold">{{ guestCounts.adults }}</span><button @click="incrementGuests('adults')" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button></div></div>
                  <div class="flex items-center justify-between py-5 border-b border-gray-200 dark:border-gray-800"><div><div class="font-semibold text-gray-900 dark:text-gray-100">Children</div><div class="text-sm text-gray-500 dark:text-gray-400">Ages 2–12</div></div><div class="flex items-center gap-4"><button @click="decrementGuests('children')" :disabled="guestCounts.children <= 0" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg></button><span class="w-10 text-center font-bold">{{ guestCounts.children }}</span><button @click="incrementGuests('children')" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button></div></div>
                  <div class="flex items-center justify-between py-5 border-b border-gray-200 dark:border-gray-800"><div><div class="font-semibold text-gray-900 dark:text-gray-100">Infants</div><div class="text-sm text-gray-500 dark:text-gray-400">Under 2</div></div><div class="flex items-center gap-4"><button @click="decrementGuests('infants')" :disabled="guestCounts.infants <= 0" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg></button><span class="w-10 text-center font-bold">{{ guestCounts.infants }}</span><button @click="incrementGuests('infants')" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button></div></div>
                  <div class="flex items-center justify-between py-5"><div><div class="font-semibold text-gray-900 dark:text-gray-100">Pets</div><div class="text-sm text-gray-500 dark:text-gray-400">Service animals</div></div><div class="flex items-center gap-4"><button @click="decrementGuests('pets')" :disabled="guestCounts.pets <= 0" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-30"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg></button><span class="w-10 text-center font-bold">{{ guestCounts.pets }}</span><button @click="incrementGuests('pets')" class="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button></div></div>
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <button @click="clearHomeSearch" class="text-sm font-semibold text-gray-600 dark:text-gray-400 underline">Clear all</button>
              <button @click="onMobilePrimary" class="px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg">{{ mobileStep === 'who' ? 'Search' : 'Next' }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import PropertyCard from '@/components/common/PropertyCard.vue'
import PropertyCardSkeleton from '@/components/common/PropertyCardSkeleton.vue'
import { useTranslation } from '@/composables/useTranslation'
import api from '@/services/api'
import { waitForPreload } from '@/services/preloadData'
import fastFetch from '@/services/fastFetch'

const router = useRouter()
const { t } = useTranslation()

const activePanel = ref(null)
const searchBarContainer = ref(null)
const whereInput = ref(null)
const isMobileSearchOpen = ref(false)
const mobileStep = ref('where')
const highlightedWhereIndex = ref(-1)
const isHeroScrolled = ref(false)

const dropdownClass = computed(() => {
  if (!activePanel.value) return ''
  const base = 'top-full'
  if (activePanel.value === 'where') return `${base} left-0 w-[450px]`
  if (activePanel.value === 'when') return `${base} left-1/2 -translate-x-1/2 w-[850px]`
  if (activePanel.value === 'who') return `${base} right-0 w-[450px]`
  return base
})

const searchQuery = ref({ location: '', checkIn: '', checkOut: '', guests: '' })
const guestCounts = ref({ adults: 1, children: 0, infants: 0, pets: 0 })

const whenMode = ref('dates') // 'dates' | 'months' | 'flexible'
const dateFlexDays = ref(0) // 0 = exact dates, otherwise ±N days
const selectedMonth = ref('') // YYYY-MM
const flexibleType = ref('weekend') // 'weekend' | 'week' | 'month'

const flexibleOptions = [
  { value: 'weekend', label: 'Weekend', sub: 'Fri–Sun' },
  { value: 'week', label: 'Week', sub: '7 nights' },
  { value: 'month', label: 'Month', sub: '30 nights' }
]

const monthOptions = computed(() => {
  const options = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const short = d.toLocaleDateString('en-US', { month: 'short' })
    const year = d.getFullYear()
    options.push({ value, short, year })
  }
  return options
})

const setWhenMode = (mode) => {
  whenMode.value = mode
  if (mode !== 'dates') {
    // keep date range in state, but stop showing calendar selection as the primary mode
    dateFlexDays.value = 0
  }
}

const setDateFlex = (days) => {
  dateFlexDays.value = days
  whenMode.value = 'dates'
}

const clearDates = () => {
  searchQuery.value.checkIn = ''
  searchQuery.value.checkOut = ''
  dateFlexDays.value = 0
  selectedMonth.value = ''
  flexibleType.value = 'weekend'
  if (whenMode.value !== 'dates') whenMode.value = 'dates'
}

const selectMonth = (value) => {
  selectedMonth.value = value
  whenMode.value = 'months'
}

const clearMonth = () => {
  selectedMonth.value = ''
}

const selectFlexible = (value) => {
  flexibleType.value = value
  whenMode.value = 'flexible'
}

const formatShortDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const dateSummary = computed(() => {
  if (whenMode.value === 'months') {
    if (!selectedMonth.value) return 'Add month'
    const [y, m] = selectedMonth.value.split('-').map(Number)
    const d = new Date(y, (m || 1) - 1, 1)
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  if (whenMode.value === 'flexible') {
    const opt = flexibleOptions.find((o) => o.value === flexibleType.value)
    return opt ? `Flexible · ${opt.label}` : 'Flexible'
  }
  if (!searchQuery.value.checkIn) return 'Add dates'
  if (!searchQuery.value.checkOut) {
    const base = formatShortDate(searchQuery.value.checkIn)
    return dateFlexDays.value ? `${base} (±${dateFlexDays.value}d)` : base
  }
  const base = `${formatShortDate(searchQuery.value.checkIn)} - ${formatShortDate(searchQuery.value.checkOut)}`
  return dateFlexDays.value ? `${base} (±${dateFlexDays.value}d)` : base
})

const guestSummary = computed(() => {
  const total = guestCounts.value.adults + guestCounts.value.children
  return total > 0 ? `${total} guest${total > 1 ? 's' : ''}` : ''
})

// Sources for administrative names:
// - Rwanda Government local government directory (districts): https://www.gov.rw/government/directory/local-government
// - CityPopulation (districts + sectors; used here for Kigali sectors): https://www.citypopulation.de/en/rwanda/sector/admin/
const rwandaPlaces = [
  // City of Kigali — districts
  { value: 'district-gasabo', title: 'Gasabo, Kigali', subtitle: 'District, Rwanda' },
  { value: 'district-kicukiro', title: 'Kicukiro, Kigali', subtitle: 'District, Rwanda' },
  { value: 'district-nyarugenge', title: 'Nyarugenge, Kigali', subtitle: 'District, Rwanda' },

  // City of Kigali — Gasabo sectors
  { value: 'sector-bumbogo-gasabo', title: 'Bumbogo, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-gatsata-gasabo', title: 'Gatsata, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-gikomero-gasabo', title: 'Gikomero, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-gisozi-gasabo', title: 'Gisozi, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-jabana-gasabo', title: 'Jabana, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-jali-gasabo', title: 'Jali, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kacyiru-gasabo', title: 'Kacyiru, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kimihurura-gasabo', title: 'Kimihurura, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kimironko-gasabo', title: 'Kimironko, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kinyinya-gasabo', title: 'Kinyinya, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-ndera-gasabo', title: 'Ndera, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-nduba-gasabo', title: 'Nduba, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-remera-gasabo', title: 'Remera, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-rusororo-gasabo', title: 'Rusororo, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-rutunga-gasabo', title: 'Rutunga, Gasabo, Kigali', subtitle: 'Sector, Rwanda' },

  // City of Kigali — Kicukiro sectors
  { value: 'sector-gahanga-kicukiro', title: 'Gahanga, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-gatenga-kicukiro', title: 'Gatenga, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-gikondo-kicukiro', title: 'Gikondo, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kagarama-kicukiro', title: 'Kagarama, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kanombe-kicukiro', title: 'Kanombe, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kicukiro-kicukiro', title: 'Kicukiro, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kigarama-kicukiro', title: 'Kigarama, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-masaka-kicukiro', title: 'Masaka, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-niboye-kicukiro', title: 'Niboye, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-nyarugunga-kicukiro', title: 'Nyarugunga, Kicukiro, Kigali', subtitle: 'Sector, Rwanda' },

  // City of Kigali — Nyarugenge sectors
  { value: 'sector-gitega-nyarugenge', title: 'Gitega, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kanyinya-nyarugenge', title: 'Kanyinya, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kigali-nyarugenge', title: 'Kigali, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-kimisagara-nyarugenge', title: 'Kimisagara, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-mageragere-nyarugenge', title: 'Mageragere, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-muhima-nyarugenge', title: 'Muhima, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-nyakabanda-nyarugenge', title: 'Nyakabanda, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-nyamirambo-nyarugenge', title: 'Nyamirambo, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-nyarugenge-nyarugenge', title: 'Nyarugenge, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },
  { value: 'sector-rwezamenyo-nyarugenge', title: 'Rwezamenyo, Nyarugenge, Kigali', subtitle: 'Sector, Rwanda' },

  // Districts — Eastern Province
  { value: 'district-bugesera', title: 'Bugesera', subtitle: 'District, Eastern Province, Rwanda' },
  { value: 'district-gatsibo', title: 'Gatsibo', subtitle: 'District, Eastern Province, Rwanda' },
  { value: 'district-kayonza', title: 'Kayonza', subtitle: 'District, Eastern Province, Rwanda' },
  { value: 'district-kirehe', title: 'Kirehe', subtitle: 'District, Eastern Province, Rwanda' },
  { value: 'district-ngoma', title: 'Ngoma', subtitle: 'District, Eastern Province, Rwanda' },
  { value: 'district-nyagatare', title: 'Nyagatare', subtitle: 'District, Eastern Province, Rwanda' },
  { value: 'district-rwamagana', title: 'Rwamagana', subtitle: 'District, Eastern Province, Rwanda' },

  // Districts — Northern Province
  { value: 'district-burera', title: 'Burera', subtitle: 'District, Northern Province, Rwanda' },
  { value: 'district-gakenke', title: 'Gakenke', subtitle: 'District, Northern Province, Rwanda' },
  { value: 'district-gicumbi', title: 'Gicumbi', subtitle: 'District, Northern Province, Rwanda' },
  { value: 'district-musanze', title: 'Musanze', subtitle: 'District, Northern Province, Rwanda' },
  { value: 'district-rulindo', title: 'Rulindo', subtitle: 'District, Northern Province, Rwanda' },

  // Districts — Southern Province
  { value: 'district-gisagara', title: 'Gisagara', subtitle: 'District, Southern Province, Rwanda' },
  { value: 'district-huye', title: 'Huye (Butare)', subtitle: 'District, Southern Province, Rwanda' },
  { value: 'district-kamonyi', title: 'Kamonyi', subtitle: 'District, Southern Province, Rwanda' },
  { value: 'district-muhanga', title: 'Muhanga', subtitle: 'District, Southern Province, Rwanda' },
  { value: 'district-nyamagabe', title: 'Nyamagabe', subtitle: 'District, Southern Province, Rwanda' },
  { value: 'district-nyanza', title: 'Nyanza', subtitle: 'District, Southern Province, Rwanda' },
  { value: 'district-nyaruguru', title: 'Nyaruguru', subtitle: 'District, Southern Province, Rwanda' },
  { value: 'district-ruhango', title: 'Ruhango', subtitle: 'District, Southern Province, Rwanda' },

  // Districts — Western Province
  { value: 'district-karongi', title: 'Karongi', subtitle: 'District, Western Province, Rwanda' },
  { value: 'district-ngororero', title: 'Ngororero', subtitle: 'District, Western Province, Rwanda' },
  { value: 'district-nyabihu', title: 'Nyabihu', subtitle: 'District, Western Province, Rwanda' },
  { value: 'district-nyamasheke', title: 'Nyamasheke', subtitle: 'District, Western Province, Rwanda' },
  { value: 'district-rubavu', title: 'Rubavu (Gisenyi)', subtitle: 'District, Western Province, Rwanda' },
  { value: 'district-rusizi', title: 'Rusizi', subtitle: 'District, Western Province, Rwanda' },
  { value: 'district-rutsiro', title: 'Rutsiro', subtitle: 'District, Western Province, Rwanda' }
]

const normalizeText = (s) => (s || '').toString().trim().toLowerCase()

const whereSuggestions = computed(() => {
  const q = normalizeText(searchQuery.value.location)
  const list = rwandaPlaces
  if (!q) return list.slice(0, 8)

  const scored = []
  for (const p of list) {
    const hay = normalizeText(`${p.title} ${p.subtitle || ''} ${p.value}`)
    const title = normalizeText(p.title)
    if (!hay.includes(q)) continue
    const score = title.startsWith(q) ? 0 : hay.startsWith(q) ? 1 : 2
    scored.push({ p, score, title: p.title })
  }

  scored.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title))
  return scored.slice(0, 8).map((x) => x.p)
})

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const calMonth = ref(new Date().getMonth())
const calYear = ref(new Date().getFullYear())

const calendarMonths = computed(() => {
  const months = []
  for (let i = 0; i < 2; i++) {
    const m = (calMonth.value + i) % 12
    const y = calYear.value + Math.floor((calMonth.value + i) / 12)
    const date = new Date(y, m, 1)
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const startDay = date.getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const days = []
    for (let j = 0; j < startDay; j++) days.push({ key: `${m}-${i}-${j}`, dayNumber: null, iso: null })
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const isPast = new Date(iso) < new Date(new Date().toDateString())
      days.push({ key: iso, dayNumber: d, iso, isPast })
    }
    months.push({ key: `${y}-${m}`, label, days, nav: i === 0 ? 'prev' : 'next' })
  }
  return months
})

const dayClass = (day) => {
  if (!day.iso) return 'invisible'
  if (day.isPast) return 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
  const isStart = searchQuery.value.checkIn === day.iso
  const isEnd = searchQuery.value.checkOut === day.iso
  const inRange = searchQuery.value.checkIn && searchQuery.value.checkOut && day.iso > searchQuery.value.checkIn && day.iso < searchQuery.value.checkOut
  if (isStart || isEnd) return 'bg-brand-600 text-white hover:bg-brand-700'
  if (inRange) return 'bg-brand-100 dark:bg-brand-900/30 text-brand-900 dark:text-brand-100'
  return 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
}

const onPickDate = (iso) => {
  if (!searchQuery.value.checkIn || searchQuery.value.checkOut) {
    searchQuery.value.checkIn = iso
    searchQuery.value.checkOut = ''
  } else if (iso > searchQuery.value.checkIn) {
    searchQuery.value.checkOut = iso
  } else {
    searchQuery.value.checkIn = iso
    searchQuery.value.checkOut = ''
  }
}

const goPrevMonth = () => {
  if (calMonth.value === 0) {
    calMonth.value = 11
    calYear.value--
  } else {
    calMonth.value--
  }
}

const goNextMonth = () => {
  if (calMonth.value === 11) {
    calMonth.value = 0
    calYear.value++
  } else {
    calMonth.value++
  }
}

const incrementGuests = (type) => guestCounts.value[type]++
const decrementGuests = (type) => {
  if (type === 'adults' && guestCounts.value[type] === 1) return
  if (guestCounts.value[type] > 0) guestCounts.value[type]--
}

const openPanel = async (panel) => {
  if (activePanel.value === panel) {
    activePanel.value = null
    return
  }
  activePanel.value = panel
  await nextTick()
  if (panel === 'where' && whereInput.value) whereInput.value.focus()
}

const closeDesktopPanel = () => activePanel.value = null

const openMobile = (step) => {
  isMobileSearchOpen.value = true
  mobileStep.value = step
}

const closeMobile = () => isMobileSearchOpen.value = false

const clearHomeSearch = () => {
  searchQuery.value = { location: '', checkIn: '', checkOut: '', guests: '' }
  guestCounts.value = { adults: 1, children: 0, infants: 0, pets: 0 }
  whenMode.value = 'dates'
  dateFlexDays.value = 0
  selectedMonth.value = ''
  flexibleType.value = 'weekend'
}

const selectWhereSuggestion = (item) => {
  searchQuery.value.location = item.title
  // Desktop: advance to next step (When)
  if (!isMobileSearchOpen.value) activePanel.value = 'when'
  else mobileStep.value = 'when'
}

watch(() => searchQuery.value.location, () => {
  highlightedWhereIndex.value = -1
})

const highlightNextWhereSuggestion = () => {
  const max = whereSuggestions.value.length - 1
  highlightedWhereIndex.value = Math.min(highlightedWhereIndex.value + 1, max)
}

const highlightPrevWhereSuggestion = () => {
  highlightedWhereIndex.value = Math.max(highlightedWhereIndex.value - 1, 0)
}

const applyHighlightedWhereSuggestion = () => {
  const list = whereSuggestions.value
  if (highlightedWhereIndex.value >= 0 && highlightedWhereIndex.value < list.length) {
    selectWhereSuggestion(list[highlightedWhereIndex.value])
  }
}

const handleClickOutside = (event) => {
  if (searchBarContainer.value && !searchBarContainer.value.closest('.relative').contains(event.target)) {
    activePanel.value = null
    highlightedWhereIndex.value = -1
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (isMobileSearchOpen.value) closeMobile()
    if (activePanel.value) closeDesktopPanel()
  }
}

onMounted(() => {
  const onScroll = () => {
    isHeroScrolled.value = window.scrollY > 24
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  loadHomeProperties()

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

const handleSearch = () => {
  activePanel.value = null
  const q = searchQuery.value.location?.trim() || ''
  const guests = guestCounts.value.adults + guestCounts.value.children
  router.push({
    path: '/accommodations',
    query: {
      ...(q ? { q } : {}),
      ...(guests ? { guests } : {}),
      ...(searchQuery.value.checkIn ? { checkIn: searchQuery.value.checkIn } : {}),
      ...(searchQuery.value.checkOut ? { checkOut: searchQuery.value.checkOut } : {}),
      ...(whenMode.value ? { whenMode: whenMode.value } : {}),
      ...(whenMode.value === 'dates' && dateFlexDays.value ? { flexDays: String(dateFlexDays.value) } : {}),
      ...(whenMode.value === 'months' && selectedMonth.value ? { month: selectedMonth.value } : {}),
      ...(whenMode.value === 'flexible' && flexibleType.value ? { flexible: flexibleType.value } : {})
    }
  })
}

const canProceedFromWhen = () => {
  if (whenMode.value === 'dates') return Boolean(searchQuery.value.checkIn && searchQuery.value.checkOut)
  if (whenMode.value === 'months') return Boolean(selectedMonth.value)
  if (whenMode.value === 'flexible') return Boolean(flexibleType.value)
  return false
}

const onDesktopPrimary = () => {
  // Behave like “Next / Search” depending on where the user is in the flow.
  if (activePanel.value === 'where') {
    activePanel.value = 'when'
    return
  }

  if (activePanel.value === 'when') {
    if (canProceedFromWhen()) activePanel.value = 'who'
    return
  }

  if (activePanel.value === 'who') {
    handleSearch()
    return
  }

  // If no panel is open, keep current behavior: run search.
  handleSearch()
}

const onMobilePrimary = () => {
  if (mobileStep.value === 'where') mobileStep.value = 'when'
  else if (mobileStep.value === 'when') mobileStep.value = 'who'
  else {
    closeMobile()
    handleSearch()
  }
}

const latestProperties = ref([])
const isLoading = ref(true)

const loadHomeProperties = async () => {
  try {
    await waitForPreload()
    const result = await fastFetch.fetchAccommodations({ limit: 10, minimal: true })
    latestProperties.value = result.data || []
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load properties:', error)
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
