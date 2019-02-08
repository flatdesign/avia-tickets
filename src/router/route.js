import Vue from 'vue'
import Router from 'vue-router'
import lazyLoading from './lazyLoading'

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      name: 'home',
      path: '/home',
      component: lazyLoading('Home'),
    },
    {
      name: 'item',
      path: '/home/:item',
      component: lazyLoading('Item'),
    }
  ]
})
