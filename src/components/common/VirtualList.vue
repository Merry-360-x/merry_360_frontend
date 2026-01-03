<template>
  <RecycleScroller
    :items="items"
    :item-size="itemSize"
    :buffer="buffer"
    key-field="id"
    v-slot="{ item }"
    class="scroller"
  >
    <slot :item="item" />
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue3-virtual-scroller'
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css'

defineProps({
  items: {
    type: Array,
    required: true
  },
  itemSize: {
    type: Number,
    default: 400 // Default height for property cards
  },
  buffer: {
    type: Number,
    default: 200 // Buffer for smoother scrolling
  }
})
</script>

<style scoped>
.scroller {
  height: 100%;
}
</style>
