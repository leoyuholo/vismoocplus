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
  data () {
    return {
      redirectTo: null
    }
  },
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
      this.redirectTo = {
        path: '/user/login'
      }

      this.$store.dispatch('user/logout')
    },
    checkPermission () {
      if (!this.user) {
        const redirectTo = this.redirectTo || { path: '/user/login', query: { redirect_from: this.$route.fullPath } }
        this.$router.push(redirectTo)
        return
      }

      if (this.permission && !this['allow' + this.permission]) {
        this.$router.push({ path: '/404' })
      }
    }
  },
  watch: {
    user () { this.checkPermission() }
  },
  mounted () {
    this.checkPermission()
  }
}
</script>
