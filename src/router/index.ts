import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/personal',
      name: 'personal',
      component: () => import('@/views/PersonalInfoPage.vue')
    },
    {
      path: '/mission',
      name: 'mission', 
      component: () => import('@/views/MissionPage.vue')
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('@/views/SkillListPage.vue')
    },
    {
      path: '/coach',
      name: 'coach',
      component: () => import('@/views/CoachChatPage.vue')
    },
    {
      path: '/subtasks',
      name: 'subtasks',
      component: () => import('@/views/SubtasksPage.vue')
    },
    {
      path: '/api-test',
      name: 'api-test',
      component: () => import('@/views/ApiTestPage.vue')
    }
  ]
})

export default router