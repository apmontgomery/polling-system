<template>
<div class="tile is-ancestor">
  <div class="tile is-parent is-vertical">
    <div class="tile is-child">
      <h2 class="title is-2 is-marginless">{{ Poll.title || 'Title' }}</h2>
      <hr>
      <h2 class="subtitle is-6 is-pulled-right has-text-weight-light">PUBLISHED: {{ dateString }}</h2>
    </div>
    <div class="tile is-vertical has-background-c2 is-child section">
      <div class="tile is-child">
        <div class="tile is-parent">
          <div class="tile is-child is-8">
            <div class="section">
              <div v-for="(option, i) in routeOptions"
                :key="i" class="field is-grouped">
                <div class="control is-expanded">
                  <button
                    :class="[
                      'button',
                      'is-medium',
                      'has-text-centered',
                      'is-uppercase',
                      'has-text-weight-bold',
                      'is-radiusless',
                      `is-c${i}`
                    ]"
                    :disabled="myAnswers.filter(x => x.responded.length > 0).map(x => x.id).indexOf(option.id) > -1 || votes.indexOf(option.id) > -1"
                    @click="vote(option.id)">{{ option.label }}</button>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-child">
            <donut-chart :chartData="routeOptions"></donut-chart>
          </div>
        </div>
        <div class="tile is-child">
          <h5 v-if="totalVotes > 0" class="subtitle is-6">Total number of Votes Recorded: {{totalVotes}}</h5>
          <h5 v-else class="subtitle is-6">Be the first to vote in today's poll.</h5>
          <hr>
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
import poll from '~/gql/queries/poll.gql'
import createReponse from '~/gql/mutations/createResponse.gql'
import myAnswers from '~/gql/queries/myAnswers.gql'
import { request } from 'graphql-request'
import { print } from 'graphql'
const simpleApi = process.env.simpleApi
// const simpleApi = 'http://localhost:60000/simple/v1/cjdh1zc4x00040166ffqq0fgc'

export default {
  async asyncData ({params}){
    return await request(simpleApi, print(poll), { sId: parseInt(params.pollid)})
  },
  data () {
    return {
      fingerprint: '',
      Poll: {},
      votes: [],
      myAnswers: []
    }
  },
  methods: {
    async changeVote(optId) {
      console.log("to do later")
    },
    async vote(optId) {
      // console.log(this.Poll.answer.type === 'SINGLE')
      if (this.Poll.answer.type === 'SINGLE'){
        this.votes = []
        this.votes.push(optId)
        console.log(this.votes)
      } else {
        this.votes.push(optId)
      }
      try {
        await request(simpleApi, print(createReponse), {optionId: optId, deviceId: this.fingerprint})
        await this.fetchPoll()
        await this.fetchMyAnswers()
      } catch (error) {
        // TODO: give user feedback
        console.log(error)
        console.log("your vote has already been recorded")
        await this.fetchMyAnswers()
      }
    },
    async fetchPoll() {
      let Poll = (await request(simpleApi, print(poll), { sId: parseInt(this.$route.params.pollid) })).Poll
    },
    async fetchMyAnswers() {
      this.myAnswers = (await request(simpleApi, print(myAnswers), {sId: parseInt(this.$route.params.pollid), deviceId: this.fingerprint})).Poll.answer.options
    }
  },
  computed: {
    totalVotes() {
      return this.routeOptions ? this.routeOptions.reduce(function(acc, cur) { return acc + cur.value }, 0) : null
    },
    routeOptions() {
      return this.Poll ? this.Poll.answer.options.map(x => ({ label: x.label, sid: x.sid, id: x.id, value: x._respondedMeta.count })) : null
    },
    dateString() {
      return new Date((this.Poll.publishedDate || 1516605447) * 1000).toLocaleString('en-HK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'})
    }
  },
  components: {
    DonutChart
  },
  mounted () {
    if (process.browser) {
      if (!this.fingerprint){
        new Fingerprint2().get((result, components) => {
          // console.log(result) //a hash, representing your device fingerprint
          this.fingerprint = result
          this.fetchMyAnswers()
        })
      }
    }
  }
}
</script>

<style>
</style>
