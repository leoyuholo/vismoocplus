<template>
  <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header">

      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        VisMOOC+
        <div slot="subtitle">HKUST VisLab</div>
      </q-toolbar-title>

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
    ...mapGetters(['courseId']),
    lectures () {
      return this.$store.getters.lectures.map(l => ({
        ...l,
        url: `/course/${l.courseId}/lecture/${l.objectId}`
      }))
    }
  },
  mounted () {
    this.$store.dispatch('getLectures')
  }
}
</script>
