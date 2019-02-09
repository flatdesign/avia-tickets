<template>
  <div class="wrapper">
    <ul class="flights">
      <li v-for="flight in getRows" :key="flight.flightNumber">
        <a href="" class="flight__item" :class="flight.delayed ? 'delayed' : ''">
          <p class="flights__time">{{flight.timeNormal}} (мск)</p>
          <p class="flights__city">{{flight.city}}</p>
          <p class="flights__number">Рейс: <span>{{flight.flightNumber}}</span></p>
          <p v-if="flight.delayed" class="flights__delayed">Задержан</p>
        </a>
      </li>
    </ul>

    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="prevPage">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item" v-for="(page, index) in getPageCount" :key="index" :class="getPageClass(index)">
          <a class="page-link" href="#" @click.prevent="setPage(index)">{{index + 1}}</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next"  @click.prevent="nextPage">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
  </nav>

  </div>


</template>

<script>
export default {
  name: 'flight-list',
  props: ['flights'],
  data () {
    return {
      rowCount: 10,
      currentPage: 0,

    }
  },
  computed: {
    getPageCount() {
      return Math.ceil(this.flights.length / this.rowCount);
    },
    getRows() {
      return this.flights.slice(this.rowCount * this.currentPage, this.rowCount * this.currentPage + this.rowCount)
    }
  },
  methods: {
    getPageClass(index) {
      if(index == this.currentPage)
        return 'active'
      else
        return ''
    },
    prevPage() {
      if(this.currentPage > 0)
        this.currentPage--
    },
    nextPage() {
      if(this.currentPage < this.getPageCount - 1)
        this.currentPage++
    },
    setPage(index) {
      this.currentPage = index;
    },
  }
}
</script>

<style lang="css" scoped>
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
</style>
