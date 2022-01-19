import Vue from 'vue'
import VueRouter from 'vue-router'
import allRoutes from './all'

Vue.use(VueRouter)

const routes = allRoutes
  
let router = new VueRouter({
    routes,
    mode: 'history'
})

export default router