<template>
  <div class="dplayer"></div>
</template>

<script>
import DPlayer from 'dplayer'
import 'dplayer/dist/DPlayer.min.css'

class HotKey {
  constructor (player) {
    this.eventListener = (e) => {
      if (player.focus) {
        const tag = document.activeElement.tagName.toUpperCase()
        const editable = document.activeElement.getAttribute('contenteditable')
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
          const event = e || window.event
          let percentage
          switch (event.keyCode) {
            case 32:
              event.preventDefault()
              player.toggle()
              break
            case 37:
              event.preventDefault()
              player.seek(player.video.currentTime - 5)
              player.controller.setAutoHide()
              break
            case 39:
              event.preventDefault()
              player.seek(player.video.currentTime + 5)
              player.controller.setAutoHide()
              break
            case 38:
              event.preventDefault()
              percentage = player.volume() + 0.1
              player.volume(percentage)
              break
            case 40:
              event.preventDefault()
              percentage = player.volume() - 0.1
              player.volume(percentage)
              break
          }
        }
        switch (event.keyCode) {
          case 27:
            if (player.fullScreen.isFullScreen('web')) {
              player.fullScreen.cancel('web')
            }
            break
        }
      }
    }
    document.addEventListener('keydown', this.eventListener)
  }

  destroy () {
    document.removeEventListener('keydown', this.eventListener)
  }
}

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
      dp: null
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
        container: this.$el,
        hotkey: false
      })

      if (this.settings.currentTime !== undefined && this.settings.currentTime !== player.video.currentTime) {
        player.seek(this.settings.currentTime)
      }
      if (this.settings.playbackRate !== undefined && this.settings.playbackRate !== player.video.playbackRate) {
        player.speed(this.settings.playbackRate)
      }
      if (this.settings.volume !== undefined && this.settings.volume !== player.video.volume) {
        player.volume(this.settings.volume, false, true)
      }
      if (this.settings.muted !== undefined && this.settings.muted !== player.video.muted) {
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

      player.hotkey = new HotKey(player)

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
      this.dp.hotkey.destroy()
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
