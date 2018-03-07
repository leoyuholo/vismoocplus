<template>
  <div></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: state => state.user.currentUser,
      userSetting: state => state.user.userSetting
    })
  },
  methods: {
    redirect () {
      if (!this.user) {
        this.$router.push({ path: '/user/login' })
      }
      else if (this.user && this.userSetting) {
        const course = this.userSetting.lastCourse || 'COMP4901F'
        const lecture = this.userSetting.lastLecture || 'index'
        this.$router.push({ path: `/course/${course}/lecture/${lecture}` })
      }
    }
  },
  watch: {
    user () { this.redirect() },
    userSetting () { this.redirect() }
  },
  mounted () {
    this.redirect()
  }
}
</script>
