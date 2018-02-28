<template>
  <q-layout ref="layout" class="bg-white" view="lhh Lpr fff" :left-class="{'bg-grey-2': true}">
    <q-toolbar slot="header">
      <q-toolbar-title>
        VisMOOC+ Analytics
        <div slot="subtitle">HKUST VisLab</div>
      </q-toolbar-title>

      <user-icon permission="Analytics" />

    </q-toolbar>

    <router-view></router-view>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'

import UserIcon from '@/widgets/UserIcon'

export default {
  components: {
    UserIcon
  },
  computed: {
    ...mapGetters(['courseId'])
  },
  mounted () {
    console.log(this.courseId)
  }
}
</script>
