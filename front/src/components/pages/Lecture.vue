<template>
    <div class="layout-padding lecture">
      <video-player
        v-if="lecture"
        :options="videoOptions"

        @ready="trackVideoAction($event)"
        @waited="trackVideoAction($event)"
        @play="trackVideoAction($event)"
        @pause="trackVideoAction($event)"
        @end="trackVideoAction($event)"
        @seek="trackVideoAction($event)"
        @quit="trackVideoAction($event)"
        @enterfullscreen="trackVideoAction($event)"
        @exitfullscreen="trackVideoAction($event)"
        @volumechange="trackVideoAction($event)"
        @ratechange="trackVideoAction($event)"
      />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VideoPlayer from '../widgets/VideoPlayer'

export default {
  components: {
    VideoPlayer
  },
  computed: {
    ...mapGetters(['courseId', 'lectureId', 'lecture']),
    videoOptions () {
      if (!this.lecture) return {}
      return {
        src: this.lecture.videoUrl,
        poster: this.lecture.posterUrl,
        caption: this.lecture.captionUrl
      }
    }
  },
  methods: {
    trackVideoAction (event) {
      const { type, ...dimensions } = event
      this.$store.dispatch('track', {
        eventName: type,
        dimensions,
        options: {
          attachPlatformInfo: false
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.lecture
  max-width: 1280px
</style>
