<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Admin/Team Content Management</h1>
    <Tabs v-model="tab" :tabs="tabs" />
    <div v-if="tab === 'properties'">
      <ManageProperties />
    </div>
    <div v-else-if="tab === 'tours'">
      <ManageTours />
    </div>
    <div v-else-if="tab === 'transport'">
      <ManageTransport />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Tabs from '@/components/common/Tabs.vue'
import ManageProperties from '@/components/admin/ManageProperties.vue'
import ManageTours from '@/components/admin/ManageTours.vue'
import ManageTransport from '@/components/admin/ManageTransport.vue'

const tab = ref('properties')
const tabs = [
  { label: 'Properties', value: 'properties' },
  { label: 'Tours', value: 'tours' },
  { label: 'Transportation', value: 'transport' }
]
</script>
