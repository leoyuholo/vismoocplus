<template>
  <q-btn flat @click="logout">
    Log out
  </q-btn>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'user-icon',
  computed: {
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
  }
}
</script>
