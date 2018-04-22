<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view v-if="initialized" />
    <p style="color:white;" v-if="!initialized" >
      Loading...
    </p>
  </div>
</template>

<script>
/*
 * Root component
 */
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      initialized: state => state.user.initialized,
      initError: state => state.user.initError
    })
  },
  watch: {
    initError (newVal, oldVal) {
      if (newVal) {
        return this.$router.push({ path: '/user/login', query: { error_msg: newVal.message } })
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
body
  background-color $tertiary
</style>
