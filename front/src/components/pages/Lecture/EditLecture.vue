<template>
  <div class="layout-padding">
    <p class="caption">Edit Lecture</p>
    <q-field>
      <q-input v-model="lecture.name" float-label="Name" :error="$v.lecture.name.$error"  @blur="$v.lecture.name.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.description" float-label="Description" :error="$v.lecture.description.$error"  @blur="$v.lecture.description.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.videoUrl" float-label="Video URL" :error="$v.lecture.videoUrl.$error" @blur="$v.lecture.videoUrl.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.posterUrl" float-label="Poster URL" :error="$v.lecture.posterUrl.$error" @blur="$v.lecture.posterUrl.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.captionUrl" float-label="Subtitle URL" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.thumbnailsUrl" float-label="Thumbnails URL" />
    </q-field>
    <div v-if="lecture.videoUrl">
      <video-player
        ref="player"
        :video="video"

        @canplay="videoReady"
        >
      </video-player>
    </div>
    <q-field>
      <q-input v-model="videoDuration" float-label="Detected Video Duration (s)" disable />
    </q-field>
    <q-field>
      <q-input v-model="lecture.videoDuration" float-label="Video Duration (s)" type="number" :after="[{icon: 'autorenew', handler: updateDuration}]" />
    </q-field>
    <q-field>
      <q-datetime v-model="lecture.releaseDate" float-label="Release Date" type="datetime" />
    </q-field>
    <message :errorMsg="errorMsg" :successMsg="successMsg" />
    <q-btn color="primary" @click="save">Save</q-btn>
    <q-btn flat @click="$router.push(previewUrl)">Preview</q-btn>
    <q-btn class="pull-right" color="negative" @click="remove">Delete</q-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import VideoPlayer from '@/widgets/VideoPlayer'
import { delayPromise } from 'src/helpers'
import Message from '@/widgets/Message'

export default {
  components: {
    Message,
    VideoPlayer
  },
  validations: {
    lecture: {
      name: { required },
      description: { required },
      videoUrl: { required },
      posterUrl: { required },
      videoDuration: { required }
    }
  },
  data () {
    const defaultLecture = { videoDuration: 0 }
    return {
      defaultLecture,
      lecture: Object.assign({}, defaultLecture, this.$store.getters['lecture/current']),
      videoDuration: 'N/A',
      errorMsg: '',
      successMsg: ''
    }
  },
  computed: {
    ...mapGetters(['courseId', 'lectureId']),
    previewUrl () { return `/course/${this.courseId}/lecture/${this.lectureId}` },
    video () {
      return {
        src: this.lecture.videoUrl,
        poster: this.lecture.posterUrl,
        caption: this.lecture.captionUrl,
        thumbnails: this.lecture.thumbnailsUrl
      }
    }
  },
  methods: {
    videoReady () {
      this.videoDuration = this.$refs.player.duration()
    },
    updateDuration () {
      this.videoReady()
      this.lecture.videoDuration = this.videoDuration
    },
    save () {
      if (this.$v.$invalid) {
        this.errorMsg = 'Missing lecture attributes.'
        return
      }

      if (this.lecture.releaseDate && this.lecture.releaseDate.toISOString) {
        this.lecture.releaseDate = this.lecture.releaseDate.toISOString()
      }

      this.$store.dispatch('lecture/update', { lectureId: this.lectureId, changes: this.lecture })
        .then(() => { this.successMsg = `Lecture ${this.lecture.name} updated.` })
        .then(() => delayPromise(2000))
        .then(() => { this.successMsg = '' })
    },
    remove () {
      this.$store.dispatch('lecture/delete', { lectureId: this.lectureId })
        .then(() => { this.successMsg = `Lecture ${this.lecture.name} deleted. Redirecting...` })
        .then(() => delayPromise(2000))
        .then(() => this.$router.push({ path: `/studio/${this.courseId}/new` }))
    }
  },
  mounted () {
    this.$store.watch(
      (store, getters) => { return getters['lecture/current'] },
      lecture => { this.lecture = Object.assign({}, this.defaultLecture, lecture) }
    )
  }
}
</script>
