<template>
  <div class="container">
    <h1 class="title">Табло рейсов</h1>

    <ul class="controls">
      <li>
        <a href="#" @click.prevent="load('arr')" :class="currentType == 'arr' ? 'active' : ''">Вылет</a>
      </li>
      <li>
        <a href="#" @click.prevent="load('dep')" :class="currentType == 'dep' ? 'active' : ''">Прилет</a>
      </li>
    </ul>

    <label>
      Поиск рейса:
      <input type="number" class="form-control" min="1" placeholder="Номер рейса" v-model="search">
    </label>

    <label>
      <input type="checkbox" v-model="delayed">
      Задержанные
    </label>


    <hr>

    <flight-list :flights="getFlights"></flight-list>

  </div>
</template>

<script>

  import axios from 'axios';
  import FlightList from './FlighList';

  export default {
    name: 'home',
    components: {
      'flight-list': FlightList
    },
    data () {
      return {
        airports: [],     // Название аэропортов
        arrival: [],    //прибытие
        departure: [],    // отправка
        currentType: 'arr',   // текущий тип (прибытие / отправка)
        search: '',         // поиск номера рейса
        delayed: false      // только задержанные
      }
    },
    computed: {
      getFlights() {
        let str = this.search;

        let flights = []
        switch(this.currentType) {
          case 'arr': {
            flights = this.arrival.slice();
            break;
          }
          case 'dep': {
            flights = this.departure.slice();
            break;
          }
        }

        if(this.delayed) {
          flights = flights.filter(obj => {
            if((obj.flightNumber).indexOf(str) + 1 && obj.delayed) {
              return true;
            }
          })
        } else {
          flights = flights.filter(obj => {
            if((obj.flightNumber).indexOf(str) + 1) {
              return true;
            }
          })
        }

        return flights.sort((a, b) => {
          if( Date.parse(a.time) > Date.parse(b.time)) {
            return 1
          } else {
            return -1;
          }
        })
       }
    },
    methods: {
      load(typeFlight) {
        this.currentType = typeFlight;
        let date = new Date;

        let params = {
          requestedAirport: "SVO",
          appId: 'ea488948',
          appKey: 'efbc990269c4b7a5003996b7405e9ba3',
          flightsType: typeFlight,
          requestedDate: `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
          requestedHour: `${date.getUTCHours() + 3}`,
          requestedNumHours: "3"
        }

        this.makeRequest(params).then(rescponce => this.parseResponceData(rescponce.data, typeFlight));
      },

      async makeRequest(params) {
        try {
          let url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/${params.requestedAirport}/${params.flightsType}/${params.requestedDate}/${params.requestedHour}?appId=${params.appId}&appKey=${params.appKey}&utc=false&numHours=${params.requestedNumHours}`

          let responce = await axios.get(url);
          return responce;
        } catch(e) {
          console.log(e);
          alert('Не удалось загрузить рейсы');
        }
      },

      parseResponceData(data, typeFlight) {

        let airpots = []
        data['appendix']['airports'].forEach(el => {
          airpots.push({ code: el.fs, name: el.name, city: el.city });
        });

        this.airports = airpots.slice()

        let flights = [];

        data['flightStatuses'].forEach(airline => {
          flights.push({
            flightNumber: airline.flightNumber,
            timeNormal: this.getTime(airline.arrivalDate.dateLocal),
            time: airline.arrivalDate.dateLocal,
            city: this.getAirport(airline[`${this.getType(typeFlight)}`]),
            delayed:  (Math.floor(Math.random() * (10 - 1)) + 1) < 2 ? true : false
          })
        });


        switch(typeFlight) {
          case 'arr': {
            this.arrival = flights.slice();
            break;
          }
          case 'dep': {
            this.departure = flights.slice();
            break;
          }
        }
      },

      getAirport(code) {
        let city = '';

        this.airports.forEach(airport => {
          if(airport.code == code) {
            city = airport.city;
          }
        });
        return city != '' ? city : 'Неизвестно';
      },

      getTime(str) {
        let milliseconds = Date.parse(str);
        let time = new Date(milliseconds);

        let options = {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }

        return time.toLocaleString("ru", options);
      },

      getType(direction) {
        switch(direction) {
          case 'arr': {
            return 'departureAirportFsCode'
            break;
          }
          case 'dep': {
            return 'arrivalAirportFsCode'
            break;
          }
        }
      },


    },

    created() {
      this.load('arr');
    }
  }
</script>

<style lang="css" scoped>

  .title {
    color: #000000;
    font-size: 25px;
    font-weight: 700;
    margin-top: 40px;
  }
  .controls {
    list-style: none;
    display: flex;
    padding: 0;
  }

  .controls a {
    display: block;
    margin-right: 50px;
    font-size: 70px;
    font-weight: 700;
    color: #000000;
    transition: color 0.3s ease;
  }

  .controls a.active {
    color: orange;
  }
  .controls a:hover,
  .controls a:focus {
    color: orange;
    text-decoration: none;
  }

  label {
    margin-right: 30px;
    cursor: pointer;
  }


</style>
