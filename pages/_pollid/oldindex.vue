<template>
<section class="section">
  <div class="columns container is-lightblue">
    <div class="column" v-if="Poll">
      <h1 class="title">{{ Poll.title }}</h1>
      <h2 class="subtitle">PUBLISHED: {{ dateString }}</h2>
      <ul v-if="Poll.answer.type.toLowerCase() === 'single'">
        <li v-for="option in Poll.answer.options" :key="option.id" class="button" @click="vote(option.id)">{{ option.label }} ({{ option._respondedMeta.count }} votes)</li>
      </ul>
      <ul v-else>
        <li v-for="option in Poll.answer.options" :key="option.id" class="button" @click="vote(option.id)">{{ option.label }} ({{ option._respondedMeta.count }} votes)</li>
      </ul>
    </div>
    <div class="column">
      chart
      <canvas width="300px" height="300px" ref="chart"></canvas>
    </div>
  </div>
</section>
</template>

<script>
import polls from '~/static/poll.json'
import poll from '~/apollo/queries/poll'
import Fingerprint2 from 'fingerprintjs2'
import createReponse from '~/apollo/mutations/createResponse'
let drawing

export default {
  asyncData: ({params}) => ({
    pollid: parseInt(params.pollid)
  }),
  data () {
    return {
      fingerprint: ''
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
    },
    draw() {
      if (!window) {
        return
      }
      window.cancelAnimationFrame(drawing)
      // let data = [{label: 'coke', votes: '200', color: '#ff0000'},{label: 'sprite', votes: '68', color: '#00ff00'},{label: 'mountain dew', votes: '90', color: '#0000ff'}]
      let data = this.routeOptions
      data.sort((a, b) => a.responseCount - b.responseCount )
      let sum = data.reduce((acc,cur) => acc + parseInt(cur.responseCount), 0)
      let chart = this.$refs.chart
      let ctx = chart.getContext('2d')
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      let w = chart.width
      let h = chart.height
      ctx.clearRect(0, 0, w, h)
      let r = w / 2 * 0.9
      let hole = w / 2 * 0.2
      let speed = 3.6
      let deg = 0
      let colors = ['#ff0000', '#00ff00', '#0000ff', '#f0ff00', '#f000ff', '#f0f0f0']
      let startDeg = 180 - Math.min(...(data.map(x => x.responseCount))) / sum * 180
      ctx.fillStyle = '#ff0000'
      ctx.translate(w/2, h/2)
      ctx.rotate(startDeg * Math.PI / 180)
      ctx.translate(-w/2, -h/2)
      let drawDegree = () => {
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, r, 0, speed * Math.PI / 180)
        ctx.arc(w / 2, h / 2, hole, speed * Math.PI / 180, 0, true)
        ctx.fill()
        ctx.stroke()
      }
      let dataIndex = 0
      function step(){
        deg ++
        if(deg > data.slice(0, dataIndex + 1).reduce((acc,cur) => acc + parseInt(cur.responseCount), 0) / sum * 100){
          dataIndex ++
        }
        ctx.fillStyle = colors[dataIndex]
        ctx.strokeStyle = colors[dataIndex]
        drawDegree()
        ctx.translate(w/2, h/2)
        ctx.rotate(speed * Math.PI / 180)
        ctx.translate(-w/2, -h/2)
        console.log(deg)
        if(deg < 360 / speed){
          drawing = window.requestAnimationFrame(step)
        }
      }
      drawing = window.requestAnimationFrame(step)
    }
  },
  computed: {
    totalVotes() {
      return this.routeOptions ? this.routeOptions.reduce(function(acc, cur) { return acc + cur.responseCount }, 0) : null
    },
    routeOptions() {
      return this.Poll ? this.Poll.answer.options.map(x => ({ label: x.label, sid: x.sid, id: x.id, responseCount: x._respondedMeta.count })) : null
    },
    dateString() {
      return new Date((this.Poll.publishedDate || 1516605447) * 1000).toLocaleString('en-HK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'})
    }
  },
  mounted () {
    this.draw()
    console.log(this.$route.params.pollid)
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
.is-lightblue {
  background-color: #B3CFE4;
}
</style>
