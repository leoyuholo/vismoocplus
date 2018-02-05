<template>
  <div class="layout-padding">
    <p class="caption">Create Lecture</p>
    <q-field>
      <q-input v-model="lecture.name" float-label="Name" :error="$v.lecture.name.$error" @blur="$v.lecture.name.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.description" float-label="Description" :error="$v.lecture.description.$error" @blur="$v.lecture.description.$touch" />
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
      <q-datetime v-model="lecture.releaseDate" float-label="Release Date" type="datetime" />
    </q-field>
    <message :errorMsg="errorMsg" :successMsg="successMsg" />
    <q-btn color="primary" @click="submit">submit</q-btn>
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
  data () {
    return {
      lecture: {
        name: '',
        description: '',
        videoUrl: '',
        posterUrl: '',
        captionUrl: '',
        releaseDate: (new Date()).toISOString()
      },
      errorMsg: '',
      successMsg: ''
    }
  },
  validations: {
    lecture: {
      name: { required },
      description: { required },
      videoUrl: { required },
      posterUrl: { required }
    }
  },
  computed: {
    ...mapGetters(['courseId'])
  },
  methods: {
    submit () {
      if (this.$v.$invalid) {
        this.errorMsg = 'Missing lecture attributes.'
        return
      }

      const lecture = {
        ...this.lecture,
        courseId: this.courseId
      }

      if (this.lecture.releaseDate && this.lecture.releaseDate.toISOString) {
        this.lecture.releaseDate = this.lecture.releaseDate.toISOString()
      }

      this.$store.dispatch('createLecture', lecture)
        .then(lecture => {
          this.successMsg = `Lecture ${lecture.name} created. Redirecting...`
          delayPromise(2000)
            .then(() => this.$router.push({ path: `/studio/${this.courseId}/lecture/${lecture.objectId}/edit` }))
        })
    },
    processFile (event, type) {
      const file = event.target.files ? event.target.files[0] : undefined
      this[type + 'File'] = file
    }
  }
}
</script>
