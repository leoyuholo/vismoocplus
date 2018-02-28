<template>
  <q-layout ref="layout" class="bg-white" view="lhh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header">

      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        VisMOOC+ Studio
        <div slot="subtitle">HKUST VisLab</div>
      </q-toolbar-title>

      <user-icon permission="Studio"/>

    </q-toolbar>

    <div slot="left">
      <lecture-list :lectures="lectures"></lecture-list>
    </div>

    <router-view></router-view>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

import LectureList from '@/widgets/LectureList'
import UserIcon from '@/widgets/UserIcon'

export default {
  components: {
    LectureList,
    UserIcon
  },
  computed: {
    ...mapGetters(['courseId']),
    lectures () {
      return this.$store.state.lecture.lectures.map(l => ({
        ...l,
        url: `/studio/${l.courseId}/lecture/${l.objectId}/edit`
      })).concat([{id: 'new', name: 'Create New Lecture', url: `/studio/${this.courseId}/new`}])
    }
  },
  mounted () {
    this.$store.dispatch('event/track', {
      eventName: 'studio',
      dimensions: {
        path: this.$route.fullPath,
        courseId: this.courseId
      }
    })

    this.$store.dispatch('lecture/getLectures', { courseId: this.courseId })
  }
}
</script>
