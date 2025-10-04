<template>
  <div class="auth-page">
    <h1>註冊</h1>
    <form @submit.prevent="onSubmit">
      <label>
        名稱
        <input v-model="name" type="text" required />
      </label>
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>
      <label>
        密碼
        <input v-model="password" type="password" required />
      </label>
      <button type="submit" :disabled="loading">建立帳號</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const loading = computed(() => store.loading)
const error = computed(() => store.error)

async function onSubmit() {
  const user = await store.createUser({ name: name.value, email: email.value, password: password.value })
  if (user) {
    router.push({ name: 'home' })
  }
}
</script>

<style scoped>
.auth-page { max-width: 420px; margin: 40px auto; display: grid; gap: 12px; }
label { display: grid; gap: 6px; font-size: 14px; }
input { padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; }
button { padding: 10px 14px; border-radius: 6px; background: #2d6cdf; color: #fff; border: none; }
.error { color: #c00; }
</style>
