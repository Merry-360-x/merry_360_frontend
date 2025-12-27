<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Add or Edit Tours</h2>
    <TourForm @created="refresh" />
    <div class="mt-8">
      <h3 class="font-bold mb-2">Existing Tours</h3>
      <TourList :refreshKey="refreshKey" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import TourForm from '@/components/admin/TourForm.vue'
import TourList from '@/components/admin/TourList.vue'
const refreshKey = ref(0)
function refresh() { refreshKey.value++ }
</script>
