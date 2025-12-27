<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Add or Edit Transportation</h2>
    <TransportForm @created="refresh" />
    <div class="mt-8">
      <h3 class="font-bold mb-2">Existing Transportation Options</h3>
      <TransportList :refreshKey="refreshKey" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import TransportForm from '@/components/admin/TransportForm.vue'
import TransportList from '@/components/admin/TransportList.vue'
const refreshKey = ref(0)
function refresh() { refreshKey.value++ }
</script>
