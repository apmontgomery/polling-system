<template>
  <div>
    <h1 class="title">{{ Poll.title }}</h1>
    <h2 class="subtitle">PUBLISHED: {{ new Date(Poll.publishedDate * 1000).toLocaleString('en-HK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'}) }}</h2>
    <ul v-if="Poll.answer.type.toLowerCase() === 'single'">
      <li v-for="option in Poll.answer.options" :key="option.id" class="button" @click="vote(option.id)">{{ option.label }} ({{ option._respondedMeta.count }} votes)</li>
    </ul>
    <ul v-else>
      <li v-for="option in Poll.answer.options" :key="option.id" class="button" @click="vote(option.id)">{{ option.label }} ({{ option._respondedMeta.count }} votes)</li>
    </ul>
  </div>
</template>

<script>
import polls from '~/static/poll.json'
import poll from '~/apollo/queries/poll'
import Fingerprint2 from 'fingerprintjs2'
import createReponse from '~/apollo/mutations/createResponse'

export default {
  asyncData({params}){
    return { pollid: params.pollid }
  },
  data () {
    return {
      fingerprint: ''
    }
  },
  apollo: {
    Poll: {
      query: poll,
      prefetch: (ctx) => {
        return {sId: parseInt(ctx.params.pollid)}
      },
      variables() {
        return { sId: parseInt(this.$route.params.pollid) }
      }
    }
  },
  methods: {
    async removeVote(optId) {
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
      } catch (error) {
        // TODO: give user feedback
        console.log(error)
        console.log("your vote has already been recorded")
      }
      this.$apollo.queries.Poll.refetch()
    }
  },
  computed: {
    totalVotes() {
      return this.routeOptions.reduce(function(acc, cur) { return acc + cur.responseCount }, 0)
    },
    routeOptions() {
      return this.Poll.answer.options.map(x => ({ label: x.label, sid: x.sid, id: x.id, responseCount: x._respondedMeta.count }))
    }
  },
  mounted () {
    if (process.browser) {
      if (!this.fingerprint){
        new Fingerprint2().get((result, components) => {
          console.log(result); //a hash, representing your device fingerprint
          this.fingerprint = result
        })
      }
    }
  }
}
</script>
