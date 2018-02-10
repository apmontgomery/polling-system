<template>
  <section class="container">
    <div>
      <h1 class="title">Today's poll</h1>
      <h2 class="subtitle">{{ todaysPoll.title }}</h2>
      <ul v-if="todaysPoll.answer.type.toLowerCase() === 'single'">
        <li v-for="option in todaysPoll.answer.options" :key="option.id" class="button">{{option.label}}</li>
      </ul>
      <ul v-else>
        <li v-for="option in todaysPoll.answer.options" :key="option.id" class="button">{{ option.label }}</li>
      </ul>
    </div>
    <div>
      <div v-for="poll in sortedPolls.slice(1, 4)" :key="poll.id">
        <h1 class="title">{{ poll.title }}</h1>
        <h2 class="subtitle">{{ new Date(poll.publishedDate).toLocaleString('en-HK', { year: 'numeric', month: 'short', day: 'numeric' }) }}</h2>
        <ul>
          <li v-for="option in poll.answer.options" :key="option.id">{{ option. label }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import polls from '~/static/poll.json'

export default {
  computed: {
    polls() { return polls.polls },
    sortedPolls() {
      let sortedpolls = this.polls
      sortedpolls.sort(function (a,b) {
        return b.publishedDate - a.publishedDate
        })
      return sortedpolls
    },
    todaysPoll() {
      return this.sortedPolls[0]
    }
  }
}
</script>

<style>
</style>
