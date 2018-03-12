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
import { mapGetters, mapState } from 'vuex'

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
      allowStudio: 'user/allowStudio',
      allowAnalytics: 'user/allowAnalytics'
    }),
    ...mapState({
      userSetting: state => state.user.userSetting
    }),
    lectures () {
      return this.$store.getters['lecture/list'].map(l => ({
        ...l,
        url: `/course/${l.courseId}/lecture/${l.objectId}`
      }))
        .concat(!this.allowStudio ? [] : [{id: 'studio', name: 'Go to studio', url: `/studio/${this.courseId}/new`}])
        .concat(!this.allowAnalytics ? [] : [{id: 'analytics', name: 'Go to analytics', url: `/analytics/${this.courseId}`}])
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
          const lectureId = (this.userSetting && this.userSetting.lastLecture) || lectures[0].objectId
          this.$router.push({ path: `/course/${this.courseId}/lecture/${lectureId}` })
        }
      })
  }
}
</script>
