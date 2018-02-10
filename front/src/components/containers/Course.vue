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

      <user-icon />

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
    ...mapGetters({
      courseId: 'courseId',
      lectureId: 'lectureId',
      userAdmin: 'user/userAdmin'
    }),
    lectures () {
      return this.$store.getters['lecture/list'].map(l => ({
        ...l,
        url: `/course/${l.courseId}/lecture/${l.objectId}`
      })).concat(!this.userAdmin ? [] : [{id: 'studio', name: 'Go to studio', url: `/studio/${this.courseId}/new`}])
    }
  },
  mounted () {
    this.$store.dispatch('event/track', {
      eventName: 'course',
      dimensions: {
        path: this.$route.fullPath,
        courseId: this.courseId,
        lectureId: this.lectureId
      }
    })

    this.$store.dispatch('lecture/getLectures', { courseId: this.courseId })
      .then(lectures => {
        if (this.lectureId === 'index' && lectures.length > 0) {
          this.$router.push({ path: `/course/${this.courseId}/lecture/${lectures[0].objectId}` })
        }
      })
  }
}
</script>
