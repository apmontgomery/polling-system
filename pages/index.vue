<template>
<div class="tile is-ancestor">
  <div class="tile is-parent is-vertical">
    <div class="tile is-vertical has-background-grey is-child section">
      <div class="tile is-child">
        <div class="tile is-child">
          <h1 class="subtitle is-4 has-text-primary"><img src="/scmp.svg" width="25rem" alt=""> Today's poll</h1>
        </div>
        <div class="tile is-parent has-background-grey">
          <div class="tile is-child is-9">
            <nuxt-link :to="`${todaysPoll.sId}`"><h2 class="title is-3 is-marginless">{{ todaysPoll.title || 'Title' }} <span class="is-size-6 has-text-sans has-text-weight-bold has-text-primary">{{ new Date(todaysPoll.publishedDate * 1000).toLocaleString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span></h2></nuxt-link>
            <div class="section">
              <div v-for="(option, i) in todaysOptions"
                :key="i" class="field is-grouped">
                <div class="control is-expanded">
                  <button
                    :class="['button', 'is-medium', 'has-text-centered', 'is-uppercase', 'has-text-weight-bold', 'is-radiusless', `is-c${i}`]"
                    @click="vote(option.id)">{{ option.label }}</button>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-child">
            <donut-chart :chartData="todaysOptions"></donut-chart>
          </div>
        </div>
        <div class="tile is-child">
          <h5 v-if="totalVotes > 0" class="subtitle is-6">Total number of Votes Recorded: {{totalVotes}}</h5>
          <h5 v-else class="subtitle is-6">Be the first to vote in today's poll.</h5>
          <hr>
        </div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="tile is-child">
        <div class="columns is-multiline">
          <div v-for="(poll, idx) in sortedPolls.slice(1, 5)" :key="poll.sId" :class="[{column: true}, {'is-6': true}, {'has-center-div': idx % 2 === 0}]">
            <nuxt-link :to="`${poll.sId || 1}`">
            <article class="media">
              <figure class="media-left">
                <p class="image is-96x96">
                  <img src="chart.svg" alt="chart" style="width:100%;">
                </p>
              </figure>
              <div class="media-content">
                <h5 class="subtitle is-6 has-text-primary has-text-weight-bold">
                  {{ new Date(poll.publishedDate * 1000).toLocaleString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' }) }}
                </h5>
                <h1 class="title is-5">{{ poll.title || 'Title' }}</h1>
              </div>
            </article>
            </nuxt-link>
            <hr class="is-hidden-mobile"
              v-if="(sortedPolls.length % 2 === 0 && idx < sortedPolls.length - 2) || (sortedPolls.length % 2 === 1 && idx < sortedPolls.length - 3)">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import polls from '~/static/poll.json'
import Fingerprint2 from 'fingerprintjs2'
import DonutChart from '~/components/DonutChart.vue'
import allPolls from '~/gql/queries/allPolls.gql'
import createReponse from '~/gql/mutations/createResponse.gql'
import { request } from 'graphql-request'
import { print } from 'graphql'
const simpleApi = process.env.simpleApi
// const simpleApi = 'http://localhost:60000/simple/v1/cjdh1zc4x00040166ffqq0fgc'

export default {
  name: 'home2',
  async asyncData ({ params }) {
    console.log(print(allPolls))
    let polldata
    await request(simpleApi, print(allPolls)).then(data => {
      console.log(data)
      polldata = data
      })
    return polldata
  },
  components: {
    DonutChart
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
      return this.allPolls[0]
    },
    todaysOptions() {
      return this.todaysPoll.answer.options.map(x => ({ label: x.label, sid: x.sid, id: x.id, value: x._respondedMeta.count }))
    },
    dateString() {
      return this.todaysPoll ?
        new Date((this.todaysPoll.publishedDate) * 1000).toLocaleString('en-HK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'}) :
        new Date(1516605447000).toLocaleString('en-HK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'})
    },
    totalVotes() {
      return this.todaysOptions.map(x => x.value).reduce((acc,cur) => acc + cur)
    }
  },
  methods: {
    async changeVote(optId) {
      console.log("to do later")
    },
    async vote(optId) {
      try {
        await request(simpleApi, print(createReponse), {optionId: optId, deviceId: this.fingerprint})
        await this.fetchAllPolls()
      } catch (error) {
        // TODO: give user feedback
        console.log(error)
        console.log("your vote has already been recorded")
      }
    },
    async fetchAllPolls() {
      let ap = await request(simpleApi, print(allPolls))
      console.log(ap.allPolls)
      this.allPolls = ap.allPolls
    }
  },
  data () {
    return {
      fingerprint: '',
      allPolls: []
    }
  },
  mounted () {
    if (process.browser) {
      if (!this.fingerprint){
        new Fingerprint2().get((result, components) => {
          // console.log(result); //a hash, representing your device fingerprint
          this.fingerprint = result
        })
      }
    }
  }
}
</script>

