import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NetworkView from '@/views/NetworkView'
import Login from "@/views/log/Login.vue";
import Qr from "@/views/log/Qr";
import Register from "@/views/log/Register";
import Home from "@/views/home/Home";


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name:'login',
    component: Login
  },
  {
    path:'/qr',
    name:'qr',
    component: Qr
  },
  {
    path: '/register',
    name:'register',
    component: Register
  },
  {
    path: '/',
    name:'home',
    component: Home
  },
  {
    path: '/home',
    name: 'home',
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
    path: '/network',
    name: 'network',
    component: NetworkView
  }
]

const router = new VueRouter({
  routes
})

export default router
