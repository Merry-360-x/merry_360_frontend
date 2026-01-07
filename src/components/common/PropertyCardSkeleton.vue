<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden border border-transparent dark:border-gray-700 animate-pulse">
    <!-- Image Skeleton -->
    <div class="aspect-square bg-gray-200 dark:bg-gray-700"></div>
    
    <!-- Content Skeleton -->
    <div class="p-2 sm:p-3">
      <!-- Title -->
      <div class="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      
      <!-- Location -->
      <div class="hidden sm:block h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 sm:mb-4"></div>
      
      <!-- Details -->
      <div class="hidden sm:flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      
      <!-- Price and Rating -->
      <div class="flex items-end justify-between">
        <div>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Lightweight skeleton loader for PropertyCard
// Shows while properties are loading for better perceived performance
</script>
