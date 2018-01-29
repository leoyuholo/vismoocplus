<template>
    <div class="layout-padding">
      <div class="flex justify-center">
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
        src: this.lecture.video.url,
        poster: this.lecture.poster.url
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
