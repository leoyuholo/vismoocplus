<template>
    <div class="layout-padding lecture">
      <video-player
        v-if="lecture"
        :options="videoOptions"

        @waited="trackVideoAction($event)"
        @play="trackVideoAction($event)"
        @pause="trackVideoAction($event)"
        @end="trackVideoAction($event)"
        @seek="trackVideoAction($event)"
        @quit="quit($event)"
        @enterfullscreen="trackVideoAction($event)"
        @exitfullscreen="trackVideoAction($event)"
        @volumechange="trackVideoAction($event)"
        @ratechange="trackVideoAction($event)"
      />
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import VideoPlayer from '../widgets/VideoPlayer'

export default {
  components: {
    VideoPlayer
  },
  computed: {
    ...mapGetters(['courseId', 'lectureId', 'lecture']),
    ...mapState(['userSetting']),
    videoOptions () {
      if (!this.lecture) return {}

      return {
        src: this.lecture.videoUrl,
        poster: this.lecture.posterUrl,
        caption: this.lecture.captionUrl,
        playbackRate: this.userSetting.playbackRate,
        volume: this.userSetting.volume,
        currentTime: this.userSetting[`progress_${this.lectureId}`] ? this.userSetting[`progress_${this.lectureId}`].currentTime : 0,
        metaInfo: {
          lectureId: this.lectureId,
          courseId: this.courseId
        }
      }
    }
  },
  methods: {
    trackVideoAction (event) {
      const { type, ...dimensions } = event
      const payload = {
        eventName: type,
        dimensions,
        options: {
          attachPlatformInfo: false
        }
      }

      return this.$store.dispatch('track', payload)
    },
    quit (event) {
      const userSettingChanges = {
        volume: event.volume,
        playbackRate: event.playbackRate,
        [`progress_${event.lectureId}`]: {
          lastVisit: Date.now(),
          currentTime: event.currentTime
        },
        lastLecture: event.lectureId,
        lastCourse: event.courseId
      }

      return Promise.all([
        this.trackVideoAction(event),
        this.$store.dispatch('saveUserSetting', userSettingChanges)
      ])
    }
  }
}
</script>

<style lang="stylus">
.lecture
  max-width: 1280px
</style>
