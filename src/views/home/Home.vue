<template>
  <MainLayout>
    <!-- Airbnb-style Hero + Search -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <video 
          autoplay 
          muted 
          loop 
          playsinline 
          loading="lazy"
          preload="metadata"
          poster="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
          class="w-full h-full object-cover"
        >
          <source src="/videos/Merry.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-black/40"></div>
      </div>

      <div class="relative z-10 container mx-auto px-3 sm:px-4">
        <div class="min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center py-12 sm:py-20">
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-semibold text-white text-center max-w-3xl px-4">
            {{ t('home.findProperty') }}
          </h1>

          <div class="mt-6 sm:mt-8 w-full max-w-4xl px-2 sm:px-0">
            <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur rounded-2xl shadow-card border border-gray-200/60 dark:border-gray-700 p-2 sm:p-3">

              <!-- Desktop segmented search bar -->
              <div class="hidden md:block" ref="searchBarContainer">
                <div class="relative">
                  <div class="flex items-stretch bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      type="button"
                      class="flex-1 text-left px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      :class="activePanel === 'where' ? 'bg-gray-50 dark:bg-gray-900' : ''"
                      @click.stop="openPanel('where')"
                    >
                      <div class="text-xs font-semibold text-text-secondary">Where</div>
                      <div class="text-sm font-semibold text-text-primary truncate">
                        {{ searchQuery.location ? searchQuery.location : t('search.whereGoing') }}
                      </div>
                    </button>

                    <div class="w-px my-3 bg-gray-200 dark:bg-gray-700"></div>

                    <button
                      type="button"
                      class="flex-1 text-left px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      :class="activePanel === 'when' ? 'bg-gray-50 dark:bg-gray-900' : ''"
                      @click.stop="openPanel('when')"
                    >
                      <div class="text-xs font-semibold text-text-secondary">When</div>
                      <div class="text-sm font-semibold text-text-primary truncate">
                        {{ dateSummary }}
                      </div>
                    </button>

                    <div class="w-px my-3 bg-gray-200 dark:bg-gray-700"></div>

                    <button
                      type="button"
                      class="flex-1 text-left px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      :class="activePanel === 'who' ? 'bg-gray-50 dark:bg-gray-900' : ''"
                      @click.stop="openPanel('who')"
                    >
                      <div class="text-xs font-semibold text-text-secondary">Who</div>
                      <div class="text-sm font-semibold text-text-primary truncate">
                        {{ guestSummary || t('search.addGuests') }}
                      </div>
                    </button>

                    <button
                      type="button"
                      @click="handleSearch"
                      class="m-2 w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors flex-shrink-0"
                      :aria-label="t('home.search')"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>

                  <!-- Desktop popovers (animated) -->
                  <Transition name="fade-scale" mode="out-in">
                    <div
                      v-if="activePanel === 'where'"
                      key="where"
                      class="absolute left-0 mt-3 w-[480px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl z-[120] overflow-hidden"
                      @click.stop
                    >
                      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
                        <div class="text-sm font-semibold text-text-primary mb-2">Suggested destinations</div>
                        <input
                          ref="whereInput"
                          v-model="searchQuery.location"
                          type="text"
                          :placeholder="t('search.whereGoing')"
                          class="w-full text-sm font-semibold focus:outline-none placeholder:text-text-muted bg-transparent text-text-primary border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3"
                          @keydown.down.prevent="highlightNextWhereSuggestion"
                          @keydown.up.prevent="highlightPrevWhereSuggestion"
                          @keydown.enter.prevent="applyHighlightedWhereSuggestion"
                        />
                      </div>
                      <div class="max-h-[360px] overflow-auto">
                        <button
                          v-for="(item, idx) in whereSuggestions"
                          :key="item.value"
                          type="button"
                          class="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          :class="idx === highlightedWhereIndex ? 'bg-gray-50 dark:bg-gray-900' : ''"
                          @mousedown.prevent="selectWhereSuggestion(item)"
                          role="option"
                          :aria-selected="idx === highlightedWhereIndex"
                        >
                          <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="text-sm font-semibold text-text-primary truncate">{{ item.title }}</div>
                            <div v-if="item.subtitle" class="text-xs text-text-muted truncate">{{ item.subtitle }}</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div
                      v-else-if="activePanel === 'when'"
                      key="when"
                      class="absolute left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl z-[120] overflow-hidden"
                      @click.stop
                    >
                      <div class="p-4 border-b border-gray-100 dark:border-gray-700">
                        <div class="inline-flex bg-gray-100 dark:bg-gray-900 rounded-full p-1">
                          <button type="button" class="px-4 py-1.5 text-sm font-semibold rounded-full bg-white dark:bg-gray-800">Dates</button>
                          <button type="button" class="px-4 py-1.5 text-sm font-semibold rounded-full text-text-secondary">Months</button>
                          <button type="button" class="px-4 py-1.5 text-sm font-semibold rounded-full text-text-secondary">Flexible</button>
                        </div>
                      </div>

                      <div class="p-4">
                        <div class="grid grid-cols-2 gap-8">
                          <div v-for="month in calendarMonths" :key="month.key">
                            <div class="flex items-center justify-between mb-3">
                              <button
                                v-if="month.nav === 'prev'"
                                type="button"
                                class="w-9 h-9 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center"
                                @click="goPrevMonth"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <div class="text-sm font-semibold text-text-primary">{{ month.label }}</div>
                              <button
                                v-if="month.nav === 'next'"
                                type="button"
                                class="w-9 h-9 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center"
                                @click="goNextMonth"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>

                            <div class="grid grid-cols-7 gap-1 text-xs text-text-muted mb-2">
                              <div v-for="d in weekDays" :key="d" class="text-center">{{ d }}</div>
                            </div>

                            <div class="grid grid-cols-7 gap-1">
                              <button
                                v-for="day in month.days"
                                :key="day.key"
                                type="button"
                                class="h-10 rounded-full text-sm font-semibold"
                                :class="dayClass(day)"
                                :disabled="!day.iso || day.isPast"
                                @click="onPickDate(day.iso)"
                              >
                                {{ day.dayNumber || '' }}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div class="mt-4 flex items-center gap-2 flex-wrap">
                          <button type="button" class="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold">Exact dates</button>
                          <button type="button" class="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-text-secondary">± 1 day</button>
                          <button type="button" class="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-text-secondary">± 2 days</button>
                          <button type="button" class="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-text-secondary">± 3 days</button>
                          <button type="button" class="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-text-secondary">± 7 days</button>
                        </div>
                      </div>
                    </div>

                    <div
                      v-else-if="activePanel === 'who'"
                      key="who"
                      class="absolute right-0 mt-3 w-[420px] bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl z-[120] overflow-hidden"
                      @click.stop
                    >
                      <div class="p-5 space-y-5">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-semibold text-text-primary">Adults</div>
                          <div class="text-xs text-text-muted">Ages 13 or above</div>
                        </div>
                        <div class="flex items-center gap-3">
                          <button
                            @click="decrementGuests('adults')"
                            :disabled="guestCounts.adults <= 1"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="w-8 text-center font-semibold">{{ guestCounts.adults }}</span>
                          <button
                            @click="incrementGuests('adults')"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-semibold text-text-primary">Children</div>
                          <div class="text-xs text-text-muted">Ages 2–12</div>
                        </div>
                        <div class="flex items-center gap-3">
                          <button
                            @click="decrementGuests('children')"
                            :disabled="guestCounts.children <= 0"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="w-8 text-center font-semibold">{{ guestCounts.children }}</span>
                          <button
                            @click="incrementGuests('children')"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-semibold text-text-primary">Infants</div>
                          <div class="text-xs text-text-muted">Under 2</div>
                        </div>
                        <div class="flex items-center gap-3">
                          <button
                            @click="decrementGuests('infants')"
                            :disabled="guestCounts.infants <= 0"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="w-8 text-center font-semibold">{{ guestCounts.infants }}</span>
                          <button
                            @click="incrementGuests('infants')"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-semibold text-text-primary">Pets</div>
                          <div class="text-xs text-text-muted">Bringing a service animal?</div>
                        </div>
                        <div class="flex items-center gap-3">
                          <button
                            @click="decrementGuests('pets')"
                            :disabled="guestCounts.pets <= 0"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span class="w-8 text-center font-semibold">{{ guestCounts.pets }}</span>
                          <button
                            @click="incrementGuests('pets')"
                            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- Mobile stacked summary (opens full-screen sheet) -->
              <div class="md:hidden" ref="searchBarContainer">
                <div class="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    @click.stop="openMobile('where')"
                  >
                    <div class="text-xs font-semibold text-text-secondary">Where</div>
                    <div class="text-sm font-semibold text-text-primary truncate">{{ searchQuery.location ? searchQuery.location : t('search.whereGoing') }}</div>
                  </button>

                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    @click.stop="openMobile('when')"
                  >
                    <div class="text-xs font-semibold text-text-secondary">When</div>
                    <div class="text-sm font-semibold text-text-primary truncate">{{ dateSummary }}</div>
                  </button>

                  <button
                    type="button"
                    class="w-full text-left px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    @click.stop="openMobile('who')"
                  >
                    <div class="text-xs font-semibold text-text-secondary">Who</div>
                    <div class="text-sm font-semibold text-text-primary truncate">{{ guestSummary || t('search.addGuests') }}</div>
                  </button>

                  <button
                    type="button"
                    @click="handleSearch"
                    class="w-full h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    {{ t('home.search') }}
                  </button>
                </div>

                <!-- Mobile full-screen sheet -->
                <div v-if="isMobileSearchOpen" class="fixed inset-0 z-[200]" @click="closeMobile">
                  <Transition name="fade" appear>
                    <div class="absolute inset-0 bg-black/40" @click="closeMobile"></div>
                  </Transition>

                  <Transition name="sheet" appear>
                    <div class="absolute inset-x-0 top-0 bottom-0 bg-white dark:bg-gray-900" @click.stop>
                    <div class="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                      <div class="text-sm font-semibold text-text-primary">Search</div>
                      <button type="button" class="w-10 h-10 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center" @click="closeMobile">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div class="p-4 overflow-auto h-[calc(100vh-140px)]">
                      <!-- Where -->
                      <div v-if="mobileStep === 'where'">
                        <div class="text-2xl font-semibold text-text-primary mb-4">Where?</div>
                        <input
                          v-model="searchQuery.location"
                          type="text"
                          :placeholder="t('search.whereGoing')"
                          class="w-full text-sm font-semibold focus:outline-none placeholder:text-text-muted bg-white dark:bg-gray-800 text-text-primary border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-4"
                        />

                        <div class="mt-4">
                          <div class="text-sm font-semibold text-text-secondary mb-2">Suggested destinations</div>
                          <button
                            v-for="item in whereSuggestions"
                            :key="item.value + '-mobile'"
                            type="button"
                            class="w-full text-left px-3 py-3 flex items-start gap-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800"
                            @click="selectWhereSuggestion(item); mobileStep = 'when'"
                          >
                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                              <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="text-base font-semibold text-text-primary truncate">{{ item.title }}</div>
                              <div v-if="item.subtitle" class="text-sm text-text-muted truncate">{{ item.subtitle }}</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      <!-- When -->
                      <div v-else-if="mobileStep === 'when'">
                        <div class="text-2xl font-semibold text-text-primary mb-4">When?</div>
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-3xl p-4">
                          <div class="inline-flex bg-gray-100 dark:bg-gray-900 rounded-full p-1 mb-4">
                            <button type="button" class="px-4 py-1.5 text-sm font-semibold rounded-full bg-white dark:bg-gray-800">Dates</button>
                            <button type="button" class="px-4 py-1.5 text-sm font-semibold rounded-full text-text-secondary">Months</button>
                            <button type="button" class="px-4 py-1.5 text-sm font-semibold rounded-full text-text-secondary">Flexible</button>
                          </div>

                          <div class="space-y-6">
                            <div v-for="month in calendarMonths" :key="month.key + '-m'">
                              <div class="flex items-center justify-between mb-3">
                                <button
                                  v-if="month.nav === 'prev'"
                                  type="button"
                                  class="w-9 h-9 rounded-full hover:bg-white/60 dark:hover:bg-gray-900/40 flex items-center justify-center"
                                  @click="goPrevMonth"
                                >
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                <div class="text-sm font-semibold text-text-primary">{{ month.label }}</div>
                                <button
                                  v-if="month.nav === 'next'"
                                  type="button"
                                  class="w-9 h-9 rounded-full hover:bg-white/60 dark:hover:bg-gray-900/40 flex items-center justify-center"
                                  @click="goNextMonth"
                                >
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                              <div class="grid grid-cols-7 gap-1 text-xs text-text-muted mb-2">
                                <div v-for="d in weekDays" :key="d + '-m'" class="text-center">{{ d }}</div>
                              </div>
                              <div class="grid grid-cols-7 gap-1">
                                <button
                                  v-for="day in month.days"
                                  :key="day.key + '-m'"
                                  type="button"
                                  class="h-10 rounded-full text-sm font-semibold"
                                  :class="dayClass(day)"
                                  :disabled="!day.iso || day.isPast"
                                  @click="onPickDate(day.iso)"
                                >
                                  {{ day.dayNumber || '' }}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Who -->
                      <div v-else>
                        <div class="text-2xl font-semibold text-text-primary mb-4">Who?</div>
                        <div class="space-y-5">
                          <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
                            <div>
                              <div class="font-semibold text-text-primary">Adults</div>
                              <div class="text-sm text-text-muted">Ages 13 or above</div>
                            </div>
                            <div class="flex items-center gap-3">
                              <button @click="decrementGuests('adults')" :disabled="guestCounts.adults <= 1" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center disabled:opacity-30">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                              </button>
                              <span class="w-8 text-center font-semibold">{{ guestCounts.adults }}</span>
                              <button @click="incrementGuests('adults')" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            </div>
                          </div>

                          <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
                            <div>
                              <div class="font-semibold text-text-primary">Children</div>
                              <div class="text-sm text-text-muted">Ages 2–12</div>
                            </div>
                            <div class="flex items-center gap-3">
                              <button @click="decrementGuests('children')" :disabled="guestCounts.children <= 0" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center disabled:opacity-30">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                              </button>
                              <span class="w-8 text-center font-semibold">{{ guestCounts.children }}</span>
                              <button @click="incrementGuests('children')" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            </div>
                          </div>

                          <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
                            <div>
                              <div class="font-semibold text-text-primary">Infants</div>
                              <div class="text-sm text-text-muted">Under 2</div>
                            </div>
                            <div class="flex items-center gap-3">
                              <button @click="decrementGuests('infants')" :disabled="guestCounts.infants <= 0" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center disabled:opacity-30">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                              </button>
                              <span class="w-8 text-center font-semibold">{{ guestCounts.infants }}</span>
                              <button @click="incrementGuests('infants')" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            </div>
                          </div>

                          <div class="flex items-center justify-between py-4">
                            <div>
                              <div class="font-semibold text-text-primary">Pets</div>
                              <div class="text-sm text-text-muted">Bringing a service animal?</div>
                            </div>
                            <div class="flex items-center gap-3">
                              <button @click="decrementGuests('pets')" :disabled="guestCounts.pets <= 0" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center disabled:opacity-30">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                              </button>
                              <span class="w-8 text-center font-semibold">{{ guestCounts.pets }}</span>
                              <button @click="incrementGuests('pets')" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                      <button type="button" class="text-sm font-semibold underline" @click="clearHomeSearch">Clear all</button>
                      <button
                        type="button"
                        class="px-6 py-3 rounded-2xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
                        @click="onMobilePrimary"
                      >
                        {{ mobileStep === 'who' ? t('home.search') : 'Next' }}
                      </button>
                    </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Primary Listings (Airbnb-style grid) -->
    <section class="bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-10">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-end justify-between mb-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-semibold text-text-primary">{{ t('home.latestProperties') }}</h2>
              <p class="text-text-secondary text-sm mt-1">{{ t('home.browseDesc') }}</p>
            </div>
            <router-link to="/accommodations" class="text-sm font-semibold text-brand-600 hover:text-brand-700">
              {{ t('home.browseMore') }}
            </router-link>
          </div>
          <div v-if="isLoading" class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            <PropertyCardSkeleton v-for="n in 10" :key="`skeleton-${n}`" />
          </div>
          <div v-else class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            <PropertyCard v-for="property in latestProperties" :key="property.id" :property="property" />
          </div>
        </div>
      </div>
    </section>

    <!-- Hosting CTA (kept, simplified) -->
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-10">
        <div class="relative overflow-hidden rounded-2xl max-w-7xl mx-auto">
          <img
            loading="lazy"
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
            alt="Try Hosting"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative p-8 md:p-12 max-w-2xl">
            <h2 class="text-2xl md:text-4xl font-semibold text-white">{{ t('home.tryHosting') }}</h2>
            <p class="mt-3 text-white/90 text-sm md:text-base">{{ t('home.tryHostingDesc') }}</p>
            <router-link
              to="/become-host"
              class="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
            >
              {{ t('home.tryHosting') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import PropertyCard from '@/components/common/PropertyCard.vue'
import PropertyCardSkeleton from '@/components/common/PropertyCardSkeleton.vue'
import { useTranslation } from '@/composables/useTranslation'
import api from '@/services/api'
import { getCachedAccommodations, setCachedAccommodations } from '@/services/accommodationCache'
import { waitForPreload } from '@/services/preloadData'
import fastFetch from '@/services/fastFetch'

const router = useRouter()
const { t } = useTranslation()

const activePanel = ref(null) // 'where' | 'when' | 'who' | null
const searchBarContainer = ref(null)
const whereInput = ref(null)

const isMobileSearchOpen = ref(false)
const mobileStep = ref('where') // 'where' | 'when' | 'who'

const highlightedWhereIndex = ref(-1)

const showGuestSelector = ref(false)
const guestSelectorContainer = ref(null)

// Toggle guest selector
const toggleGuestSelector = () => {
  showGuestSelector.value = !showGuestSelector.value
}

// Close guest selector when clicking outside
const handleClickOutside = (event) => {
  if (guestSelectorContainer.value && !guestSelectorContainer.value.contains(event.target)) showGuestSelector.value = false
  if (searchBarContainer.value && !searchBarContainer.value.contains(event.target)) {
    activePanel.value = null
    highlightedWhereIndex.value = -1
  }
}

// Add and remove event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const searchQuery = ref({
  location: '',
  checkIn: '',
  checkOut: '',
  guests: ''
})

const guestCounts = ref({
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0
})

const minCheckInDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minCheckOutDate = computed(() => {
  if (searchQuery.value.checkIn) {
    const checkIn = new Date(searchQuery.value.checkIn)
    checkIn.setDate(checkIn.getDate() + 1)
    return checkIn.toISOString().split('T')[0]
  }
  return minCheckInDate.value
})

const guestSummary = computed(() => {
  const totalGuests = guestCounts.value.adults + guestCounts.value.children
  const hasAny = totalGuests + guestCounts.value.infants + guestCounts.value.pets
  if (!hasAny) return ''
  const parts = []
  if (guestCounts.value.adults > 0) parts.push(`${guestCounts.value.adults} adult${guestCounts.value.adults > 1 ? 's' : ''}`)
  if (guestCounts.value.children > 0) parts.push(`${guestCounts.value.children} child${guestCounts.value.children > 1 ? 'ren' : ''}`)
  if (guestCounts.value.infants > 0) parts.push(`${guestCounts.value.infants} infant${guestCounts.value.infants > 1 ? 's' : ''}`)
  if (guestCounts.value.pets > 0) parts.push(`${guestCounts.value.pets} pet${guestCounts.value.pets > 1 ? 's' : ''}`)
  return parts.join(', ')
})

const incrementGuests = (type) => {
  guestCounts.value[type]++
}

const decrementGuests = (type) => {
  if (guestCounts.value[type] > 0) {
    if (type === 'adults' && guestCounts.value[type] === 1) return
    guestCounts.value[type]--
  }
}

const openPanel = async (panel) => {
  activePanel.value = panel
  highlightedWhereIndex.value = -1
  await nextTick()
  if (panel === 'where' && whereInput.value) whereInput.value.focus()
}

const openMobile = (step) => {
  isMobileSearchOpen.value = true
  mobileStep.value = step
}

const closeMobile = () => {
  isMobileSearchOpen.value = false
}

const clearHomeSearch = () => {
  searchQuery.value.location = ''
  searchQuery.value.checkIn = ''
  searchQuery.value.checkOut = ''
  guestCounts.value = { adults: 1, children: 0, infants: 0, pets: 0 }
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
const nearbyProperties = ref([])
const topRatedProperties = ref([])
const featuredProperties = ref([])
const isLoading = ref(true)
const sectionsLoaded = ref(false)

const extractAccommodations = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const loadHomeProperties = async () => {
  try {
    // Ultra-fast fetch with aggressive caching - fetch 10 for 2x5 grid
    const result = await fastFetch.fetchAccommodations({ limit: 10, minimal: true })
    const all = result.data || []
    
    if (all.length === 0) {
      isLoading.value = false
      return
    }
    
    const take = (start, count) => all.slice(start, start + count)
    
    // Show first 10 immediately for 2x5 grid
    latestProperties.value = take(0, 10)
    isLoading.value = false
    
    // Progressive load other sections (non-blocking)
    setTimeout(() => {
      nearbyProperties.value = take(0, 10)
      featuredProperties.value = all.length > 4 ? take(0, 4) : []
      topRatedProperties.value = [...all]
        .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
        .slice(0, 4)
      sectionsLoaded.value = true
      
      // Prefetch more data for accommodations page
      fastFetch.prefetchNextPage({ limit: 20 })
    }, 50)
    
  } catch (error) {
    console.error('Failed to load home properties:', error)
    isLoading.value = false
  }
}

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const calendarBaseMonth = ref(new Date())

const toISODate = (d) => {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return date.toISOString().split('T')[0]
}

const formatMonthLabel = (d) => d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const addMonths = (d, delta) => new Date(d.getFullYear(), d.getMonth() + delta, 1)

const buildMonthDays = (monthDate) => {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const last = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  const startWeekday = first.getDay()
  const daysInMonth = last.getDate()

  const todayIso = toISODate(new Date())
  const out = []

  for (let i = 0; i < startWeekday; i++) {
    out.push({ key: `${monthDate.getFullYear()}-${monthDate.getMonth()}-pad-${i}`, dayNumber: '', iso: '', isPast: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toISODate(new Date(monthDate.getFullYear(), monthDate.getMonth(), day))
    out.push({
      key: iso,
      dayNumber: day,
      iso,
      isPast: iso < todayIso
    })
  }

  const remainder = out.length % 7
  if (remainder !== 0) {
    const pads = 7 - remainder
    for (let i = 0; i < pads; i++) {
      out.push({ key: `${monthDate.getFullYear()}-${monthDate.getMonth()}-pad2-${i}`, dayNumber: '', iso: '', isPast: false })
    }
  }

  return out
}

const calendarMonths = computed(() => {
  const m0 = new Date(calendarBaseMonth.value.getFullYear(), calendarBaseMonth.value.getMonth(), 1)
  const m1 = addMonths(m0, 1)
  return [
    { key: `${m0.getFullYear()}-${m0.getMonth()}`, label: formatMonthLabel(m0), nav: 'prev', days: buildMonthDays(m0) },
    { key: `${m1.getFullYear()}-${m1.getMonth()}`, label: formatMonthLabel(m1), nav: 'next', days: buildMonthDays(m1) }
  ]
})

const goPrevMonth = () => {
  calendarBaseMonth.value = addMonths(calendarBaseMonth.value, -1)
}

const goNextMonth = () => {
  calendarBaseMonth.value = addMonths(calendarBaseMonth.value, 1)
}

const onPickDate = (iso) => {
  if (!iso) return

  const start = searchQuery.value.checkIn
  const end = searchQuery.value.checkOut

  if (!start || (start && end)) {
    searchQuery.value.checkIn = iso
    searchQuery.value.checkOut = ''
    return
  }

  if (iso <= start) {
    searchQuery.value.checkIn = iso
    searchQuery.value.checkOut = ''
    return
  }

  searchQuery.value.checkOut = iso
}

const isInRange = (iso) => {
  const start = searchQuery.value.checkIn
  const end = searchQuery.value.checkOut
  if (!iso || !start || !end) return false
  return iso > start && iso < end
}

const dayClass = (day) => {
  if (!day.iso) return 'text-transparent'
  if (day.isPast) return 'text-text-muted opacity-40 cursor-not-allowed'

  const start = searchQuery.value.checkIn
  const end = searchQuery.value.checkOut

  const isStart = Boolean(start && day.iso === start)
  const isEnd = Boolean(end && day.iso === end)
  const inRange = isInRange(day.iso)

  if (isStart || isEnd) return 'bg-text-primary text-white'
  if (inRange) return 'bg-gray-100 dark:bg-gray-900 text-text-primary'
  return 'hover:bg-gray-50 dark:hover:bg-gray-900 text-text-primary'
}

const formatDateShort = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const dateSummary = computed(() => {
  const start = searchQuery.value.checkIn
  const end = searchQuery.value.checkOut
  if (!start && !end) return 'Add dates'
  if (start && !end) return formatDateShort(start)
  return `${formatDateShort(start)} - ${formatDateShort(end)}`
})

const normalizeSuggestion = (value) => String(value || '').trim()
const whereSuggestions = computed(() => {
  const term = String(searchQuery.value.location || '').trim().toLowerCase()
  const items = []
  const seen = new Set()

  const push = (title, subtitle, value) => {
    const key = String(value || title).toLowerCase()
    if (!key || seen.has(key)) return
    if (term && !String(title).toLowerCase().includes(term) && !String(subtitle || '').toLowerCase().includes(term)) return
    seen.add(key)
    items.push({ title, subtitle, value })
  }

  push('Nearby', "Find what's around you", 'Nearby')

  const source = latestProperties.value || []
  for (const p of source) {
    const loc = normalizeSuggestion(p?.location)
    if (loc) push(loc, '', loc)
  }

  return items.slice(0, 8)
})

const selectWhereSuggestion = (item) => {
  searchQuery.value.location = item?.value || ''
  activePanel.value = null
  highlightedWhereIndex.value = -1
}

const highlightNextWhereSuggestion = () => {
  const len = whereSuggestions.value.length
  if (!len) return
  const next = highlightedWhereIndex.value + 1
  highlightedWhereIndex.value = next >= len ? 0 : next
}

const highlightPrevWhereSuggestion = () => {
  const len = whereSuggestions.value.length
  if (!len) return
  const prev = highlightedWhereIndex.value - 1
  highlightedWhereIndex.value = prev < 0 ? len - 1 : prev
}

const applyHighlightedWhereSuggestion = () => {
  const idx = highlightedWhereIndex.value
  const item = idx >= 0 ? whereSuggestions.value[idx] : null
  if (item) selectWhereSuggestion(item)
}

const buildSearchQuery = () => {
  const q = String(searchQuery.value.location || '').trim()
  const guests = (Number(guestCounts.value.adults) || 0) + (Number(guestCounts.value.children) || 0)
  const checkIn = String(searchQuery.value.checkIn || '').trim()
  const checkOut = String(searchQuery.value.checkOut || '').trim()

  return {
    ...(q ? { q } : {}),
    ...(guests ? { guests: String(guests) } : {}),
    ...(checkIn ? { checkIn } : {}),
    ...(checkOut ? { checkOut } : {})
  }
}

const handleSearch = () => {
  activePanel.value = null
  showGuestSelector.value = false
  router.push({
    path: '/accommodations',
    query: buildSearchQuery()
  })
}

// Hero Video Carousel
onMounted(async () => {
  // Wait for preload to complete (or return immediately if already cached)
  await waitForPreload()
  await loadHomeProperties()
})
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 160ms ease, transform 180ms ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(16px);
}

.sheet-enter-to,
.sheet-leave-from {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-scale-enter-active,
  .fade-scale-leave-active,
  .fade-enter-active,
  .fade-leave-active,
  .sheet-enter-active,
  .sheet-leave-active {
    transition: none;
  }
}
</style>
