<template>
  <div class="container">
    <h1>{{msg}}</h1>
    <button class="btn btn-success" @click="getItems">Загрузить</button>
  </div>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'app',
    data () {
      return {
        msg: 'Welcome',
        url: 'https://api.rasp.yandex.net/v3.0/search/?apikey={1eb31582-941a-3ac8-a61f-041c344495ab}&format=json&from=c146&to=c213&lang=ru_RU&page=1&date=2015-09-02'
      }
    },
    methods: {
      async MakeRequest(url) {
        try {
          let responce = await axios.get(url);
          return responce;
        } catch(e) {
          console.log(e);
          //alert('Не удалось загрузить рейсы');
        }
      },
      getItems() {
        this.MakeRequest(this.url).then(rescponce => console.log(rescponce));
      }
    }
  }
</script>

<style lang="css">
</style>
