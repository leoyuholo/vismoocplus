<template>
  <q-layout ref="layout" class="bg-white" view="lhh Lpr fff" :left-class="{'bg-grey-2': true}">
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
import { mapGetters, mapState } from 'vuex'
import LectureList from '../widgets/LectureList'

export default {
  components: {
    LectureList
  },
  computed: {
    ...mapGetters(['courseId', 'lectureId', 'userAdmin']),
    ...mapState(['user']),
    lectures () {
      return this.$store.getters.lectures.map(l => ({
        ...l,
        url: `/course/${l.courseId}/lecture/${l.objectId}`
      })).concat(!this.userAdmin ? [] : [{id: 'studio', name: 'Go to studio', url: `/studio/${this.courseId}/new`}])
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push({ path: '/' }))
    }
  },
  mounted () {
    console.log(this.$route.fullPath)
    this.$store.dispatch('track', {
      eventName: 'course',
      dimensions: {
        path: this.$route.fullPath,
        courseId: this.courseId,
        lectureId: this.lectureId
      }
    })

    if (!this.user) {
      this.$router.push({ path: '/', query: { redirect_from: this.$route.fullPath } })
      return
    }

    this.$store.dispatch('getLectures')
      .then(lectures => {
        if (this.lectureId === 'index' && lectures.length > 0) {
          this.$router.push({ path: `/course/${this.courseId}/lecture/${lectures[0].objectId}` })
        }
      })
  }
}
</script>
