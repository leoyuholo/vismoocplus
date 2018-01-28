<template>
  <q-layout ref="layout" class="bg-white" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header">

      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        VisMOOC+
        <div slot="subtitle">HKUST VisLab</div>
      </q-toolbar-title>

      <q-btn flat @click="logout">
        Log out
      </q-btn>

    </q-toolbar>

    <div slot="left">
      <lecture-list :lectures="lectures"></lecture-list>
    </div>

    <router-view></router-view>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import LectureList from '../widgets/LectureList'

export default {
  components: {
    LectureList
  },
  computed: {
    ...mapGetters(['courseId', 'lectureId']),
    lectures () {
      return this.$store.getters.lectures.map(l => ({
        ...l,
        url: `/course/${l.courseId}/lecture/${l.objectId}`
      }))
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push({ path: '/' }))
    }
  },
  mounted () {
    this.$store.dispatch('getLectures', { courseId: this.$route.params.courseId })
      .then(lectures => {
        if (this.lectureId === 'index' && lectures.length > 0) {
          this.$router.push({ path: `/course/${this.courseId}/lecture/${lectures[0].objectId}` })
        }
      })
  }
}
</script>
