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
      path: '/subtasks',
      name: 'subtasks',
      component: () => import('@/views/SubtasksPage.vue')
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
      name: 'personality-test',
      component: () => import('@/views/PersonalityTestPage.vue')
    }
  ]
})

export default router