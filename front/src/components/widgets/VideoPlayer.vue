<template>
  <div>
    <vue-video-player class="video-player-box"
                   ref="videoPlayer"
                   :options="playerOptions"
                   :playsinline="true"

                   @pause="onPlayerPause($event)"
                   @ended="onPlayerEnded($event)"
                   @waiting="onPlayerWaiting($event)"
                   @playing="onPlayerPlaying($event)"
                   @timeupdate="onPlayerTimeupdate($event)"

                   @ready="playerReadied">
    </vue-video-player>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'video-player',
  props: ['options'],
  components: {
    vueVideoPlayer: videoPlayer
  },
  data () {
    return {
      currentTime: 0,
      volume: 1,
      playbackRate: 1
    }
  },
  computed: {
    playerOptions () {
      return {
        // videojs options
        language: 'en',
        playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: this.options.src
        }],
        poster: this.options.poster
      }
    }
  },
  methods: {
    emit (type, props) {
      // events: [
      //   'ready',
      //   'waited',
      //   'play',
      //   'pause',
      //   'end',
      //   'seek',
      //   'enterfullscreen',
      //   'exitfullscreen',
      //   'volumechange',
      //   'ratechange',
      //   'quit'
      // ]
      const event = {
        type,
        currentTime: this.currentTime,
        playbackRate: this.playbackRate,
        volume: this.volume,
        fullscreen: this.fullscreen,
        waitSince: this.waitSince
      }

      if (props) {
        Object.entries(props).forEach(([k, v]) => {
          event[k] = v
        })
      }

      return this.$emit(type, event)
    },
    playerReadied (player) {
      player.on('seeking', this.onSeeking)
      player.on('volumechange', this.onVolumeChange)
      player.on('ratechange', this.onRateChange)
      player.on('fullscreenchange', this.onFullscreenChange)

      this.currentTime = player.currentTime()
      this.volume = player.volume()
      this.playbackRate = player.playbackRate()
      this.fullscreen = player.isFullscreen()

      this.emit('ready')
    },
    onPlayerWaiting (player) {
      this.waitSince = Date.now()
    },
    onPlayerTimeupdate (player) {
      this.currentTime = player.currentTime()

      if (this.waitSince) {
        this.emit('waited', {
          waitSince: this.waitSince,
          waitEnd: Date.now()
        })
        this.waitSince = undefined
      }
    },
    onPlayerPlaying (player) {
      this.emit('play')
    },
    onPlayerPause (player) {
      this.emit('pause')
    },
    onPlayerEnded (player) {
      this.emit('end')
    },
    onSeeking (event) {
      this.emit('seek', {
        oldTime: this.currentTime,
        newTime: event.target.player.currentTime()
      })
    },
    onFullscreenChange (event) {
      if (event.target.player.isFullscreen()) {
        this.fullscreen = true
        this.emit('enterfullscreen')
      }
      else {
        this.fullscreen = false
        this.emit('exitfullscreen')
      }
    },
    onVolumeChange (player) {
      const newVolume = event.target.player.volume()
      this.emit('volumechange', {
        oldVolume: this.volume,
        newVolume
      })
      this.volume = newVolume
    },
    onRateChange (event) {
      const newRate = event.target.player.playbackRate()
      this.emit('ratechange', {
        oldRate: this.playbackRate,
        newRate
      })
      this.playbackRate = newRate
    }
  },
  watch: {
    options (newOptions, oldOptions) {
      if (newOptions.src !== oldOptions.src) {
        this.emit('quit')
      }
    }
  },
  beforeDestroy () {
    this.emit('quit')
  }
}
</script>
