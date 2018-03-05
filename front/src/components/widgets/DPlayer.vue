<template>
  <div class="dplayer"></div>
</template>

<script>
import DPlayer from 'dplayer'
import 'dplayer/dist/DPlayer.min.css'

export default {
  props: {
    options: {
      type: Object
    },
    settings: {
      type: Object
    }
  },
  data () {
    return {
      dp: null,
      key: 0
    }
  },
  methods: {
    emit (key, type, event) {
      if (key === this.key) {
        this.$emit(type, event)
      }
    },
    initDPlayer () {
      const key = this.key = this.key + 1

      const player = new DPlayer({
        ...this.options,
        container: this.$el
      })

      player.seek(this.settings.currentTime)
      player.speed(this.settings.playbackRate)
      player.volume(this.settings.volume, false, true)
      player.video.muted = this.settings.muted

      Object.keys(player.events).forEach(item => {
        if (item === 'events') {
          return false
        }
        else {
          player.events[item].forEach(event => {
            player.on(event, () => this.emit(key, event, player))
          })
        }
      })

      this.dp = player

      this.$emit('ready')
    },
    destroyDPlayer () {
      if (!this.dp) {
        return
      }

      this.dp.pause()
      this.dp.controller.destroy()
      this.dp.time.destroy()
      this.dp.video.src = ''
      this.dp.container.innerHTML = ''
      this.dp.events.trigger('destroy')
      // DPlayer destroy does not work well since it does not remove its listeners
    }
  },
  mounted () {
    this.initDPlayer()
  },
  watch: {
    options (newOptions, oldOptions) {
      this.destroyDPlayer()
      this.initDPlayer()
    }
  }
}
</script>

<style lang="stylus">
.dplayer
  p
    font-size: inherit
</style>
