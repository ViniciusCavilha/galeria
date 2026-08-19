import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { isAuthenticated } from '@/services/auth';
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: () => isAuthenticated.value ? '/home' : '/login' },
  { path: '/login', component: () => import('@/views/LoginPage.vue'), meta: { guestOnly: true } },
  { path: '/cadastro', component: () => import('@/views/RegisterPage.vue'), meta: { guestOnly: true } },
  { path: '/home', component: () => import('@/views/HomePage.vue'), meta: { requiresAuth: true } },
  { path: '/sobre', component: () => import('@/views/AboutPage.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) return '/login';
  if (to.meta.guestOnly && isAuthenticated.value) return '/home';
  return true;
});
export default router;
