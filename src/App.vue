<template>
  <div class="wrapper">
    <home-app></home-app>
  </div>
</template>

<script>

import Home from './components/Home'

  export default {
    name: 'app',
    components: {
      'home-app' : Home
    },
    data () {
      return {

      }
    },
  }

</script>

<style lang="css">
</style>
