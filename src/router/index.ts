import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/views/RegisterPage.vue')
    },
    {
      path: '/personal-info',
      name: 'personal-info',
      component: () => import('@/views/PersonalInfoPage.vue')
    },
    {
      path: '/personal',
      redirect: { name: 'personal-info' }
    },
    {
      path: '/mission',
      name: 'mission', 
      component: () => import('@/views/MissionPage.vue')
    },
    {
      path: '/mission/:type',
      name: 'mission-type',
      component: () => import('@/views/TaskTypeDetailPage.vue')
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('@/views/SkillListPage.vue')
    },
    {
      path: '/skills/:skillName/tasks',
      name: 'skill-tasks',
      component: () => import('@/views/SkillTasksPage.vue')
    },
    {
      path: '/coach',
      name: 'coach',
      component: () => import('@/views/CoachChatPage.vue')
    },
    {
      path: '/task/:id',
      name: 'task-detail',
      component: () => import('@/views/TaskDetailPage.vue')
    },
    {
      path: '/api-test',
      name: 'api-test',
      component: () => import('@/views/ApiTestPage.vue')
    },
    {
      path: '/personality-test',
      name: 'personality-test-selection',
      component: () => import('@/views/QuizSelectionPage.vue')
    },
    {
      path: '/personality-test/compact',
      name: 'personality-test-compact',
      component: () => import('@/views/PersonalityTestPage.vue')
    },
    {
      path: '/personality-test/full',
      name: 'personality-test-full',
      component: () => import('@/views/PersonalityTestFullPage.vue')
    }
  ]
})

// 簡單的全域守衛：未登入則導向登入/註冊
router.beforeEach((to, from, next) => {
  const publicRoutes = new Set(['login', 'register'])
  const userStore = useUserStore()
  const isAuthenticated = Boolean(userStore.user?.id)

  if (!isAuthenticated && !publicRoutes.has(to.name as string)) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router