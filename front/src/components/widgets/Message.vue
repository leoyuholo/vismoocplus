<template>
  <div>
    <p class="text-negative" v-if="errorMsg && !successMsg">{{errorMsg}}</p>
    <p class="text-positive" v-if="successMsg">{{successMsg}}</p>
  </div>
</template>

<script>
export default {
  name: 'message',
  props: ['errorMsg', 'successMsg']
}
</script>
