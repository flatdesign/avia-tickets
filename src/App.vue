<template>
  <div class="container">
    <h1>Табло рейсов</h1>

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

    <ul class="flights">
      <li v-for="flight in getFlights" :key="flight.flightNumber">
        <p>Номер: {{flight.flightNumber}}</p>
        <p>Город: {{flight.city}}</p>
        <p>Время: {{flight.time}}</p>
        <p v-if="flight.delayed">
          Задержан
        </p>
      </li>
    </ul>

  </div>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'app',
    data () {
      return {
        airports: [],     // Название аэропортов
        arrival: [],    //прибытие
        departure: [],    // отправка
        currentType: 'arr',   // текущий тип (прибытие / отправка)
        search: ''          // поиск номера рейса
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

        return flights.filter(obj => {
          if((obj.flightNumber).indexOf(str) + 1) {
            return true;
          }
        })
       }
    },
    methods: {
      load(typeFlight) {
        this.currentType = typeFlight;

        let params = {
          requestedAirport: "SVO",
          appId: 'ea488948',
          appKey: 'efbc990269c4b7a5003996b7405e9ba3',
          flightsType: typeFlight,
          requestedDate: "2019/2/7",
          requestedHour: "10",
          requestedNumHours: "1"
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
            time: this.getTime(airline.arrivalDate.dateLocal),
            city: this.getAirport(airline[`${this.getType(typeFlight)}`]),
            delayed:  (Math.floor(Math.random() * (10 - 1)) + 1) < 2 ? true : false
          })
        });


        switch(typeFlight) {
          case 'arr': {
            this.arrival = flights.slice();
            console.log(this.arrival);
            break;
          }
          case 'dep': {
            this.departure = flights.slice();
            console.log(this.departure);
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


    }
  }
</script>

<style lang="css">
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
</style>
