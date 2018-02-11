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
                    :class="['button', 'is-medium', 'has-text-centered', 'is-uppercase', 'has-text-weight-bold', 'is-radiusless', `is-c${i}`]"
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
import polls from '~/static/poll.json'
import poll from '~/apollo/queries/poll'
import Fingerprint2 from 'fingerprintjs2'
import createReponse from '~/apollo/mutations/createResponse'
import DonutChart from '~/components/DonutChart.vue'

export default {
  asyncData: ({params}) => ({
    pollid: parseInt(params.pollid)
  }),
  data () {
    return {
      fingerprint: '',
      Poll: {}
    }
  },
  apollo: {
    Poll: {
      query: poll,
      prefetch: ({ route }) => {
        return {
          sId: parseInt(route.params.pollid),
        }
      },
      variables () {
        return {
          sId: this.pollid,
        }
      }
    }
  },
  methods: {
    async changeVote(optId) {
      console.log("to do later")
    },
    async vote(optId) {
      try {
        await this.$apollo.mutate({
          mutation: createReponse,
          variables: {
            deviceId: `${this.fingerprint || Math.random().toString()}`, // using random device id for now
            optionId: optId
          }
        })
        await this.$apollo.queries.Poll.refetch()
        await this.draw()
      } catch (error) {
        // TODO: give user feedback
        console.log(error)
        console.log("your vote has already been recorded")
      }
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
        // new Fingerprint2().get((result, components) => {
        //   console.log(result) //a hash, representing your device fingerprint
        //   this.fingerprint = result
        // })
      }
      // window.onNuxtReady((app) => this.draw())
    }
  }
}
</script>

<style>
</style>
