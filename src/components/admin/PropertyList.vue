<template>
  <div>
    <ul>
      <li v-for="property in properties" :key="property.id" class="mb-4 p-2 border rounded">
        <div class="flex items-center gap-4">
          <img v-if="property.image_url" :src="property.image_url" class="w-16 h-16 object-cover rounded" />
          <div>
            <div class="font-bold">{{ property.name }}</div>
            <div class="text-sm text-gray-600">{{ property.description }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/services/supabase.js'
const props = defineProps({ refreshKey: Number })
const properties = ref([])
async function load() {
  const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
  properties.value = data || []
}
onMounted(load)
watch(() => props.refreshKey, load)
</script>
