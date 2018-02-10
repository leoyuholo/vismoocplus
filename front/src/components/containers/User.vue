<template>
  <div class="layout-padding login-form row justify-center">
    <router-view></router-view>
  </div>
</template>

<style lang="stylus">
@import '~variables'
.login-form
  .q-card
    background-color $white
  @media (max-width $breakpoint-xs-max)
    .q-card
      width 100%
</style>
