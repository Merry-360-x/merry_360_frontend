<template>
  <form @submit.prevent="submit">
    <div class="mb-4">
      <label class="block font-medium mb-1">Name</label>
      <input v-model="form.name" class="input" required />
    </div>
    <div class="mb-4">
      <label class="block font-medium mb-1">Description</label>
      <textarea v-model="form.description" class="input" required />
    </div>
    <div class="mb-4">
      <label class="block font-medium mb-1">Image (AV/AR)</label>
      <input type="file" @change="onFileChange" accept="image/*" />
      <div v-if="form.imageUrl" class="mt-2">
        <img :src="form.imageUrl" alt="Tour image" class="w-32 h-32 object-cover rounded" />
      </div>
    </div>
    <button class="btn btn-primary" :disabled="loading">Add Tour</button>
  </form>
</template>
<script setup>
import { ref } from 'vue'
import { uploadImage } from '@/services/cloudinary.js'
import { supabase } from '@/services/supabase.js'
import { showToast } from '@/composables/useToast.js'
const emit = defineEmits(['created'])
const form = ref({ name: '', description: '', imageUrl: '' })
const loading = ref(false)
async function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  loading.value = true
  try {
    const url = await uploadImage(file)
    form.value.imageUrl = url
  } catch (err) {
    showToast('Image upload failed', 'error')
  } finally {
    loading.value = false
  }
}
async function submit() {
  loading.value = true
  const { name, description, imageUrl } = form.value
  try {
    const { error } = await supabase.from('tours').insert({ name, description, image_url: imageUrl })
    if (error) throw error
    showToast('Tour added', 'success')
    form.value = { name: '', description: '', imageUrl: '' }
    emit('created')
  } catch (err) {
    showToast('Failed to add tour', 'error')
  } finally {
    loading.value = false
  }
}
</script>
