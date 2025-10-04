<template>
  <div class="auth-page">
    <h1>登入</h1>
    <form @submit.prevent="onSubmit">
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>
      <label>
        密碼
        <input v-model="password" type="password" required />
      </label>
      <button type="submit" :disabled="loading">登入</button>
      <button type="button" class="secondary" @click="goRegister">沒有帳號？前往註冊</button>
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

const email = ref('')
const password = ref('')

const loading = computed(() => store.loading)
const error = computed(() => store.error)

async function onSubmit() {
  const ok = await store.login({ email: email.value, password: password.value })
  if (ok) {
    router.push({ name: 'home' })
  }
}

function goRegister() {
  router.push({ name: 'register' })
}
</script>

<style scoped>
.auth-page { max-width: 420px; margin: 40px auto; display: grid; gap: 12px; }
label { display: grid; gap: 6px; font-size: 14px; }
input { padding: 8px 10px; border: 1px solid #ddd; border-radius: 6px; }
button { padding: 10px 14px; border-radius: 6px; background: #2d6cdf; color: #fff; border: none; }
.secondary { margin-top: 8px; background: transparent; color: #2d6cdf; border: 1px solid #2d6cdf; }
.error { color: #c00; }
</style>
