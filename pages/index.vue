<template>
  <section class="section">
    <div class="container is-grey">
      <section class="section">
          <div class="columns">
            <div class="column is-8">
              <h1 class="title is-4 has-text-primary"><img src="/scmp.svg" width="25rem" alt=""> Today's poll</h1>
              <nuxt-link :to="`${todaysPoll.sId}`"><h2 class="title is-3">{{ todaysPoll.title }} <span class="is-size-5 has-text-info">{{ new Date(todaysPoll.publishedDate * 1000).toLocaleString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span></h2></nuxt-link>
              <div
                v-for="(option, index) in todaysPoll.answer.options"
                :key="option.id">
                <button :class="[{button: true}, {'is-secondary': index % 2 === 0}, {'is-primary': index % 2 === 1}]">
                  {{option.label}}
                </button><br/>
              </div>
            </div>
            <div class="column">
              <img src="chart.svg" alt="chart" style="width:90%;" class="is-pulled-right">
            </div>
          </div>
      </section>
    </div>
    <div>
      <section class="section">
        <div class="columns is-multiline">
          <div v-for="poll in sortedPolls.slice(1, 5)" :key="poll.sId" class="column is-6">
            <div class="section">
              <div class="columns">
                <div class="column is-3">
                  <img src="chart.svg" alt="chart" style="width:100%;">
                </div>
                <div class="column">
                  <h2 class="subtitle is-5 has-text-info">{{ new Date(poll.publishedDate * 1000).toLocaleString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' }) }}</h2>
                    <nuxt-link :to="`${poll.sId}`"><h1 class="title is-4">{{ poll.title }}</h1></nuxt-link>
                    <!-- <ul>
                      <li v-for="option in poll.answer.options" :key="option.id">{{ option. label }}</li>
                    </ul> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import polls from '~/static/poll.json'
// import Fingerprint2 from 'fingerprintjs2'
import allPolls from '~/apollo/queries/allPolls'

export default {
  apollo: {
    allPolls: {
      prefetch: true,
      query: allPolls
    }
  },
  computed: {
    sortedPolls() {
      let sortedpolls = [...this.allPolls]
      sortedpolls.sort(function (a,b) {
        return b.publishedDate - a.publishedDate
        })
      return sortedpolls
    },
    todaysPoll() {
      return this.sortedPolls[0]
    },
    todaysOptions() {
      return this.todaysPoll.answer.options.map(x => ({ label: x.label, sid: x.sid, id: x.id, responseCount: x._respondedMeta.count }))
    }
  },
  data () {
    return {
      fingerprint: ''
    }
  },
  mounted () {
    if (process.browser) {
      if (!this.fingerprint){
        window.onNuxtReady((app) => {
          new Fingerprint2().get(function(result, components){
            console.log(result); //a hash, representing your device fingerprint
            this.fingerprint = result
          })
        })
      }
    }
  }
}
</script>

<style>
.is-grey {
  background-color: #DBDBDB;
}
.is-blue {
  color: #133B6B;
}
</style>
