<template>
  <svg width="100%" height="100%" viewBox="0 0 50 50" class="donut">
    <circle class="donut-hole" cx="25" cy="25" r="15.91549430918954" fill="transparent"></circle>
    <circle class="donut-ring" cx="25" cy="25" r="15.91549430918954" fill="transparent" stroke="#ffffff" stroke-width="18"></circle>

    <circle class="donut-segment"
      v-for="(segment, i) in segments"
      :key="segment.label"
      cx="25"
      cy="25"
      r="15.91549430918954"
      fill="transparent"
      :stroke="segment.color || defaultColors[i]"
      stroke-width="18"
      :stroke-dasharray="segment.dasharray"
      :stroke-dashoffset="segment.offset"></circle>

    <g class="chart-text"
      v-for="(value, i) in segments"
      :key="i">
      <text :class="['chart-label', {small: value.percent <= 12}, {smaller: value.percent < 5}, {hidden: value.percent < 2}]"
        dominant-baseline="central"
        :x="`${value.labelx * 2}%`"
        :y="`${- value.labely * 2}%`"
        v-if="value.percent">
        {{ value.percent }}
      </text>
    </g>
    <!-- unused 10% -->
    <g class="chart-text">
      <text dominant-baseline="central" x="0%" y="0%" class="chart-center">
        %
      </text>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'donut-chart',
  props: {
    chartData: {
      type: Array,
      default: () => [{label: '', color: '#f0f0f0', value: 0}]
    }
  },
  data () {
    return {
      defaultColors: ['#E46C2C', '#133B6B','#881600', '#EDAE49', '#3E5641', '#FAC9B8', '#E5D4C0', '#E3E36A', '#aac9e1', '#EDAE49']
    }
  },
  computed: {
    startingOffset() {
      return Math.floor((this.chartData[0].percent || 1) / 2) + 50
    },
    segments() {
      var clonedArray = JSON.parse(JSON.stringify(this.chartData))
      return clonedArray.map((x, i, a)=> {
        x.percent = Math.round(x.value / (a.reduce(function(acc, cur){ return acc + cur.value},0)) * 100)
        return x
      })
        .map((x, i, a) => {
          x.percent = i === a.length -1 ?
            100 - (a.slice(0, a.length - 1).map((x) => x.percent).reduce((acc, cur) => acc + cur)) :
            x.percent
          x.dasharray = `${x.percent - 0.3} ${100 - x.percent + 0.3}`
          x.offset = i === 0 ? `${this.startingOffset}` : `${100 - a.map(x => parseInt(x.percent)).slice(0, i).reduce(function(acc,cur){ return acc + cur}) + this.startingOffset}`
          x.labelx = Math.cos((x.offset - x.percent / 2)*3.6 * 0.01745329252) * 15.91549430918954
          x.labely = Math.sin((x.offset - x.percent / 2)*3.6 * 0.01745329252) * 15.91549430918954
          return x
        })
    }
  }
}
</script>


<style lang="scss">
.chart-text {
  font: 20px/1.8em "Montserrat", Arial, sans-serif;
  fill: #fff;
  font-weight: bolder;
  transform: translate(50%, 50%);
  .chart-label {
    font-size: 0.4em;
    text-anchor: middle;
    vertical-align: middle;
  }
  .small {
    font-size: 0.2em;
  }
  .smaller {
    font-size: 0.1em;
  }
  .hidden {
    display: none;
  }
}

.chart-center {
  font-size: 0.4em;
  line-height: 1;
  text-anchor: middle;
}

.donut {
  box-shadow: 0 0 0 #000;
  transform: translate3d(0,0,0);
}

.donut-hole {
  box-shadow: 0 0 0 #000;
  transform: translate3d(0,0,0);
}

.donut-segment {
  box-shadow: 0 0 0 #000;
  transform: translate3d(0,0,0);
  animation: dash 1.5s linear forwards;
}

@keyframes dash {
  0% {
    stroke-dasharray: 0 100;
  }
}
</style>
