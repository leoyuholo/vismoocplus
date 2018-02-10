<template>
    <div class="layout-padding lecture">
      <video-player
        v-if="lecture"
        :options="videoOptions"

        @ready="trackVideoAction($event)"
        @waited="trackVideoAction($event)"
        @play="trackVideoAction($event)"
        @pause="trackVideoAction($event)"
        @end="trackAndSave($event)"
        @seek="trackAndSave($event)"
        @enterfullscreen="trackVideoAction($event)"
        @exitfullscreen="trackVideoAction($event)"
        @volumechange="trackAndSave($event)"
        @ratechange="trackAndSave($event)"
        @switch="trackAndSave($event)"
        @close="trackAndSave($event)"
        @heartbeat="trackVideoAction($event)"
      />
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import VideoPlayer from '@/widgets/VideoPlayer'

export default {
  components: {
    VideoPlayer
  },
  computed: {
    ...mapGetters({
      courseId: 'courseId',
      lectureId: 'lectureId',
      lecture: 'lecture/current'
    }),
    ...mapState({
      userSetting: state => state.user.userSetting
    }),
    videoOptions () {
      if (!this.lecture) { return {} }

      return {
        src: this.lecture.videoUrl,
        poster: this.lecture.posterUrl,
        caption: this.lecture.captionUrl,

        playbackRate: this.userSetting.playbackRate,
        volume: this.userSetting.volume,
        muted: this.userSetting.muted,

        currentTime: this.$store.getters['user/lectureProgress'](this.lectureId),

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

      return this.$store.dispatch('event/track', payload)
    },
    saveUserSetting (event) {
      const changes = {
        playbackRate: event.playbackRate,
        volume: event.volume,
        muted: event.muted,
        lastLecture: event.lectureId,
        lastCourse: event.courseId
      }
      const lectureProgress = {
        [event.lectureId]: event.currentTime
      }

      return this.$store.dispatch('user/saveUserSetting', { changes, lectureProgress })
    },
    trackAndSave (event) {
      return Promise.all([
        this.trackVideoAction(event),
        this.saveUserSetting(event)
      ])
    }
  }
}
</script>

<style lang="stylus">
.lecture
  max-width: 1280px
</style>
