<template>
  <q-btn flat @click="logout">
    Log out
  </q-btn>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'user-icon',
  props: ['permission'],
  computed: {
    ...mapGetters({
      allowStudio: 'user/allowStudio',
      allowAnalytics: 'user/allowAnalytics'
    }),
    ...mapState({
      user: state => state.user.currentUser
    })
  },
  methods: {
    logout () {
      this.$store.dispatch('user/logout')
        .then(() => this.$router.push({ path: '/' }))
    }
  },
  mounted () {
    if (!this.user) {
      this.$router.push({ path: '/', query: { redirect_from: this.$route.fullPath } })
    }

    if (this.permission && !this['allow' + this.permission]) {
      this.$router.push({ path: '/404' })
    }
  }
}
</script>
