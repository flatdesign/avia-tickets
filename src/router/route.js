import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Home from '../components/Home.vue'
import Item from '../components/Item.vue'

export default new Router({
  mode: 'hash',
  routes: [
    {
      name: 'home',
      path: '/home',
      component: Home,
    },
    {
      name: 'item',
      path: '/home/:item',
      component: Item,
    }
  ]
})
