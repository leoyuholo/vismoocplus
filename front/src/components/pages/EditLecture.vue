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
    <message :errorMsg="errorMsg" :successMsg="successMsg" />
    <q-btn color="primary" @click="save">Save</q-btn>
    <q-btn flat @click="$router.push(previewUrl)">Preview</q-btn>
    <q-btn class="pull-right" color="negative" @click="remove">Delete</q-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { delayPromise } from '../../helpers'
import Message from '../widgets/Message'

export default {
  components: {
    Message
  },
  validations: {
    lecture: {
      name: { required },
      description: { required },
      videoUrl: { required },
      posterUrl: { required }
    }
  },
  data () {
    return {
      lecture: Object.assign({}, this.$store.getters.lecture),
      errorMsg: '',
      successMsg: ''
    }
  },
  computed: {
    ...mapGetters(['courseId', 'lectureId']),
    previewUrl () { return `/course/${this.courseId}/lecture/${this.lectureId}` }
  },
  methods: {
    save () {
      if (this.$v.$invalid) {
        this.errorMsg = 'Missing lecture attributes.'
        return
      }

      this.$store.dispatch('updateLecture', { id: this.lectureId, changes: this.lecture })
        .then(() => {
          this.successMsg = `Lecture ${this.lecture.name} updated.`
        })
        .then(() => delayPromise(2000))
        .then(() => {
          this.successMsg = ''
        })
    },
    remove () {
      this.$store.dispatch('deleteLecture', { id: this.lectureId })
        .then(() => {
          this.successMsg = `Lecture ${this.lecture.name} deleted. Redirecting...`
        })
        .then(() => delayPromise(2000))
        .then(() => this.$router.push({ path: `/studio/${this.courseId}/new` }))
    }
  },
  mounted () {
    this.$store.watch((store, getters) => { return getters.lecture }, lecture => { this.lecture = Object.assign({}, lecture) })
  }
}
</script>
