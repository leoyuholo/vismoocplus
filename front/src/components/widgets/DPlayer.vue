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
    emit (type, player) {
      if (player === this.dp) {
        this.$emit(type, player)
      }
    },
    initDPlayer () {
      const player = new DPlayer({
        ...this.options,
        container: this.$el
      })

      if (this.settings.currentTime !== undefined) {
        player.seek(this.settings.currentTime)
      }
      if (this.settings.playbackRate !== undefined) {
        player.speed(this.settings.playbackRate)
      }
      if (this.settings.volume !== undefined) {
        player.volume(this.settings.volume, false, true)
      }
      if (this.settings.muted !== undefined) {
        player.video.muted = this.settings.muted
      }

      Object.keys(player.events).forEach(item => {
        if (item === 'events') {
          return false
        }
        else {
          player.events[item].forEach(event => {
            player.on(event, () => this.emit(event, player))
          })
        }
      })

      this.dp = player
      setImmediate(() => this.emit('ready', player))
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
