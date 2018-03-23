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
      initialized: state => state.user.initialized
    })
  }
}
</script>

<style lang="stylus">
@import '~variables'
body
  background-color $tertiary
</style>
