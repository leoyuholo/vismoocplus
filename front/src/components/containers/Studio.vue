<template>
  <q-layout ref="layout" class="bg-white" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header">

      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        VisMOOC+ Studio
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
    ...mapGetters(['courseId']),
    ...mapState(['user']),
    lectures () {
      return this.$store.getters.lectures.map(l => ({
        ...l,
        url: `/studio/${l.courseId}/lecture/${l.objectId}/edit`
      })).concat([{id: 'new', name: 'Create New Lecture', url: `/studio/${this.courseId}/new`}])
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push({ path: '/' }))
    }
  },
  mounted () {
    this.$store.dispatch('track', {
      eventName: 'studio',
      dimensions: {
        path: this.$route.fullPath,
        courseId: this.courseId
      }
    })

    if (!this.user) {
      this.$router.push({ path: '/' })
      return
    }
    this.$store.dispatch('getLectures', { courseId: this.$route.params.courseId })
  }
}
</script>
