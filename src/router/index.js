import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NetworkView from '@/views/home/creation/NetworkView'
import Login from '@/views/log/Login.vue'
import Register from '@/views/log/Register'
import Home from '@/views/Home'
import Welcome from '@/views/home/welcome/Welcome'
import Creation from '@/views/home/creation/Creation'
import Collection from '@/views/home/collection/Collection'
import My from '@/views/home/my/My'
import NetworkCreate from '@/views/home/creation/NetworkCreate'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/creation',
      component: Creation
    }, {
      path: '/collection',
      component: Collection
    }, {
      path: '/my',
      component: My
    }]
  },
  {
    path: '/home-view',
    name: 'home-view',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  },
  {
    path: '/networkCreate/:netId',
    name: 'networkCreate',
    component: NetworkCreate
  },
  {
    path: '/networkView',
    name: 'networkView',
    component: NetworkView
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   if(to.path==='/login') return next();
//   const  tokenStr =window.sessionStorage.getItem('token')
//   if(!tokenStr) return  next('/login')
//   next()
// })

export default router
