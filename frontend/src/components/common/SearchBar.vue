<template>
  <Card padding="lg" class="max-w-5xl mx-auto shadow-african backdrop-blur-xl border-2 border-white/40">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <!-- Destination -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-text-primary mb-3">Where to?</label>
        <div class="relative">
          <input 
            type="text" 
            placeholder="Kigali, Akagera, Volcanoes..."
            v-model="localQuery.destination"
            class="w-full px-5 py-4 pl-12 glass border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:glass-strong font-medium text-base backdrop-blur-xl transition-all"
          />
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Dates -->
      <div>
        <label class="block text-sm font-bold text-text-primary mb-3">When?</label>
        <input 
          type="date" 
          v-model="localQuery.date"
          class="w-full px-5 py-4 glass border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:glass-strong font-medium text-base backdrop-blur-xl transition-all"
        />
      </div>

      <!-- Type -->
      <div>
        <label class="block text-sm font-bold text-text-primary mb-3">Type</label>
        <select 
          v-model="localQuery.type"
          class="w-full px-5 py-4 glass border border-white/40 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:glass-strong font-medium text-base backdrop-blur-xl transition-all"
        >
          <option value="all">All</option>
          <option value="stays">Stays</option>
          <option value="tours">Tours</option>
          <option value="transport">Transport</option>
        </select>
      </div>
    </div>

    <Button variant="primary" size="lg" full-width class="mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700" @click="handleSearch">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      Search
    </Button>
  </Card>
</template>

<script setup>
import { ref, watch } from 'vue'
import Card from './Card.vue'
import Button from './Button.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      destination: '',
      date: '',
      type: 'all'
    })
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const localQuery = ref({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  localQuery.value = { ...newVal }
}, { deep: true })

watch(localQuery, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

const handleSearch = () => {
  emit('search', localQuery.value)
}
</script>
