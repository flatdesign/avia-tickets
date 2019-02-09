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

    <ul class="flights">
      <li v-for="flight in getFlights" :key="flight.flightNumber">
        <a href="" class="flight__item" :class="flight.delayed ? 'delayed' : ''">
          <p class="flights__time">{{flight.time}}</p>
          <p class="flights__city">{{flight.city}}</p>
          <p class="flights__number">Рейс: <span>{{flight.flightNumber}}</span></p>
          <p v-if="flight.delayed" class="flights__delayed">Задержан</p>
        </a>
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
        search: '',         // поиск номера рейса
        delayed: false
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
          return flights.filter(obj => {
            if((obj.flightNumber).indexOf(str) + 1 && obj.delayed) {
              return true;
            }
          })
        } else {
          return flights.filter(obj => {
            if((obj.flightNumber).indexOf(str) + 1) {
              return true;
            }
          })
        }


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

  .flights {
    padding: 0;
    list-style: none;
  }
  .flight__item {
    display: block;
    position: relative;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 45px;
    padding-bottom: 45px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    border: 1px solid black;
    transition: all 0.2s ease;
  }


  .flight__item:hover,
  .flight__item:focus {
    text-decoration: none;
    box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.2);
    background-color: #7fff7f;
  }

  .flight__item:hover .flights__city,
  .flight__item:focus .flights__city {
    color: #077307;
  }

  .flights__city {
    font-size: 35px;
    line-height: 40px;
    font-weight: 700;
    color: #000000;
    margin-left: 40px;
    transition: color 0.3s ease;
  }

  .flights__time {
    font-size: 18px;
    line-height: 35px;
    color: #000000;
  }

  .flights__number {
    font-size: 18px;
    color: #000000;
    margin-left: auto;
    margin-right: 50px;
  }

  .flights__number span{
    font-size: 22px;
    line-height: 35px;
    font-weight: 700;
  }

  .flights__delayed {
    position: absolute;
    left: 15px;
    top: 15px;
    font-weight: 700;
    color: #000000;
    text-transform: uppercase;
  }

  .flight__item.delayed {
    background-color: #ff9c9c;
  }

  label {
    margin-right: 30px;
    cursor: pointer;
  }


</style>
