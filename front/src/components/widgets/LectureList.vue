<template>
  <q-list no-border link inset-delimiter>
    <q-list-header>Lecture Videos</q-list-header>
    <q-side-link v-for="lecture in lectures" item :to="lecture.url" :key="lecture.id">
      <q-item-side icon="play arrow" />
      <q-item-main :label="lecture.name" :sublabel="lecture.description" />
    </q-side-link>
  </q-list>
</template>

<script>
export default {
  name: 'lecture-list',
  props: ['lectures']
}
</script>
