import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Home from '../components/Home.vue'

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/*',
      redirect: { name: 'home' },
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
    }
  ]
})
