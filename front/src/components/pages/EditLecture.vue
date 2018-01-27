<template>
  <div class="layout-padding">
    <p class="caption">Edit Lecture</p>
    <q-field>
      <q-input v-model="lecture.name" float-label="Lecture Name" :error="$v.lecture.name.$error"  @blur="$v.lecture.name.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.description" float-label="Lecture Description" :error="$v.lecture.description.$error"  @blur="$v.lecture.description.$touch" />
    </q-field>
    <q-field helper="Video">
      <input name="video" type="file" @change="processFile($event, 'video')">
    </q-field>
    <q-field helper="Poster">
      <input name="poster" type="file" @change="processFile($event, 'poster')">
    </q-field>
    <q-btn color="primary" @click="save">Save</q-btn>
    <q-btn flat @click="$router.push(previewUrl)">Preview</q-btn>
    <q-btn class="pull-right" color="negative" @click="remove">Delete</q-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { alert } from '../../helpers'

export default {
  validations: {
    lecture: {
      name: { required },
      description: { required }
    }
  },
  data () {
    return {
      lecture: Object.assign({}, this.$store.getters.lecture)
    }
  },
  computed: {
    ...mapGetters(['courseId', 'lectureId']),
    previewUrl () { return `/course/${this.courseId}/lecture/${this.lectureId}` }
  },
  methods: {
    save () {
      const changes = {
        name: this.lecture.name,
        description: this.lecture.description
      }
      if (this.videoFile) {
        changes.videoFile = this.videoFile
      }
      if (this.posterFile) {
        changes.posterFile = this.posterFile
      }
      this.$store.dispatch('updateLecture', { id: this.lectureId, changes })
        .then(() => alert('positive', `Lecture ${this.lecture.name} updated.`))
    },
    remove () {
      this.$store.dispatch('deleteLecture', this.lectureId)
        .then(() => alert('positive', `Lecture ${this.lecture.name} deleted. Redirecting...`))
        .then(() => this.$router.push({ path: `studio/${this.courseId}/lecture/new` }))
    },
    processFile (event, type) {
      const file = event.target.files ? event.target.files[0] : undefined
      this[type + 'File'] = file
    }
  },
  mounted () {
    this.$store.watch((store, getters) => { return getters.lecture }, (lecture) => { this.lecture = Object.assign({}, lecture) })
  }
}
</script>
