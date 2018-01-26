<template>
  <div class="layout-padding">
    <p class="caption">Create Lecture</p>
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
    <q-btn color="primary" @click="submit">submit</q-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { alert } from '../../helpers'

export default {
  data () {
    return {
      lecture: {
        name: '',
        description: ''
      }
    }
  },
  validations: {
    lecture: {
      name: { required },
      description: { required }
    }
  },
  computed: {
    ...mapGetters(['courseId'])
  },
  methods: {
    submit () {
      const lecture = {
        ...this.lecture,
        courseId: this.courseId,
        videoFile: this.videoFile,
        posterFile: this.posterFile
      }
      this.$store.dispatch('createLecture', lecture)
        .then(lecture =>
          alert('positive', `Lecture ${lecture.name} created. Redirecting...`)
            .then(() => this.$router.push({ path: `studio/${this.courseId}/lecture/${lecture.id}/edit` }))
        )
    },
    processFile (event, type) {
      const file = event.target.files ? event.target.files[0] : undefined
      this[type + 'File'] = file
    }
  }
}
</script>
