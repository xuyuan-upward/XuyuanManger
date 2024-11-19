import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/RootView.vue'),
    redirect: '/home',
    /* 访问 /home 时的行为
当你访问 /home 时，会发生以下情况：
匹配父路由：
首先匹配到 path: '/' 的路由配置。
由于 Main.vue 是父组件，它会被渲染。
匹配子路由：
在 Main.vue 内部的 <router-view> 中，会匹配到 path: '/home' 的子路由。
因此，Home.vue 会在 Main.vue 的 <router-view> 中渲染。 */
    children: [
      /* {
        path: '/home',
        name: 'home',
        component: () => import('@/views/MainView.vue')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/UserView.vue')
      }, {
        path: '/mall',
        name: 'mall',
        component: () => import('@/views/MallView.vue')
      }, */
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  //也是一级路由
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404View.vue')
  }

]
const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router