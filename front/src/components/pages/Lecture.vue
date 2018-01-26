<template>
    <div class="layout-padding">
      <div class="flex justify-center">
        <video-player v-if="lecture" :options="videoOptions"/>
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
  }
}
</script>
