<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Add or Edit Properties</h2>
    <PropertyForm @created="refresh" />
    <div class="mt-8">
      <h3 class="font-bold mb-2">Existing Properties</h3>
      <PropertyList :refreshKey="refreshKey" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import PropertyForm from '@/components/admin/PropertyForm.vue'
import PropertyList from '@/components/admin/PropertyList.vue'
const refreshKey = ref(0)
function refresh() { refreshKey.value++ }
</script>
