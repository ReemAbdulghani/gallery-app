import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewAlbum from '../views/NewAlbum.vue'
import MyAlbums from '../views/MyAlbums.vue'
import { useAuth } from "@/composables/useAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'my-albums',
      component: MyAlbums,
      meta: { requiresAuth: true },
    },
    {
      path: '/albums/new',
      name: 'create-album',
      component: NewAlbum,
      meta: { requiresAuth: true },
    },
    {
      path: '/albums/:id/edit',
      name: 'edit-album',
      component: () => import('@/views/EditAlbum.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/albums/:id',
      name: 'album-details',
      component: () => import('@/views/AlbumDetails.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/auth/Signup.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  // Protect routes that require authentication
  const { user } = useAuth();

  // 1️⃣ Auth guard
  if (to.meta.requiresAuth && !user.value) {
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  next();
});
export default router

