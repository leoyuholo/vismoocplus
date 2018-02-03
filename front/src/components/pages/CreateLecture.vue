<template>
  <div class="layout-padding">
    <p class="caption">Create Lecture</p>
    <q-field>
      <q-input v-model="lecture.name" float-label="Lecture Name" :error="$v.lecture.name.$error" @blur="$v.lecture.name.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.description" float-label="Lecture Description" :error="$v.lecture.description.$error" @blur="$v.lecture.description.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.videoUrl" float-label="Lecture Video URL" :error="$v.lecture.videoUrl.$error" @blur="$v.lecture.videoUrl.$touch" />
    </q-field>
    <q-field>
      <q-input v-model="lecture.posterUrl" float-label="Lecture Poster URL" :error="$v.lecture.posterUrl.$error" @blur="$v.lecture.posterUrl.$touch" />
    </q-field>
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
        posterUrl: ''
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
      this.$store.dispatch('createLecture', this.lecture)
        .then(lecture => {
          this.successMsg = `Lecture ${lecture.name} created. Redirecting...`
          return delayPromise(2000)
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
