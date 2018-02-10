<template>
  <div>
    <h1 class="title">{{ routePoll.title }}</h1>
    <h2 class="subtitle">PUBLISHED: {{ new Date(routePoll.publishedDate * 1000).toLocaleString('en-HK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'}) }}</h2>
    <ul v-if="routePoll.answer.type.toLowerCase() === 'single'">
      <li v-for="option in routePoll.answer.options" :key="option.id" class="button">{{ option.label }}</li>
    </ul>
    <ul v-else>
      <li v-for="option in routePoll.answer.options" :key="option.id" class="button">{{ option.label }}</li>
    </ul>
  </div>
</template>

<script>
import polls from '~/static/poll.json'
export default {
  data () {
    return {
      pollResults: [
        {
          id: 1,
          options: [
            {
              id: 1,
              label: "yes",
              responses: 24
            },
            {
              id: 2,
              label: "no",
              responses: 163
            }
          ]
        },
        {
          id: 2,
          options: [
            {
              id: 3,
              label: "yes",
              responses: 24
            },
            {
              id: 4,
              label: "no",
              responses: 163
            }
          ]
        },
        {
          id: 3,
          options: [
            {
              id: 5,
              label: "yes",
              responses: 24
            },
            {
              id: 6,
              label: "no",
              responses: 163
            }
          ]
        },
        {
          id: 4,
          options: [
            {
              id: 7,
              label: "Hong Kong",
              responses: 24
            },
            {
              id: 8,
              label: "China",
              responses: 163
            },
            {
              id: 9,
              label: "Australia",
              responses: 163
            },
            {
              id: 10,
              label: "Thailand",
              responses: 163
            },
            {
              id: 11,
              label: "Korea",
              responses: 163
            },
            {
              id: 12,
              label: "Japan",
              responses: 163
            }
          ]
        },
        {
          id: 5,
          options: [
            {
              id: 13,
              label: "yes",
              responses: 24
            },
            {
              id: 14,
              label: "no",
              responses: 163
            }
          ]
        },
      ]
    }
  },
  computed: {
    polls() { return polls.polls },
    sortedPolls() {
      let sortedpolls = this.polls
      sortedpolls.sort(function (a,b) {
        return b.publishedDate - a.publishedDate
        })
      return sortedpolls
    },
    routePoll() {
      return this.$route.params.pollid ? this.polls.filter(x => x.id.toString() === this.$route.params.pollid)[0] : undefined
    }
  }
}
</script>
