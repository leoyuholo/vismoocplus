<template>
  <div>
    <vue-video-player
      v-if="playerOptions"
      :options="playerOptions"

      class="video-player-box"
      ref="videoPlayer"
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
import 'videojs-hotkeys'
import { debounce } from 'lodash'
import { nextItem, previousItem } from 'src/helpers'

export default {
  name: 'video-player',
  props: {
    options: {
      src: {
        type: String,
        required: true
      },
      poster: {
        type: String,
        default: ''
      },
      caption: {
        type: String,
        default: ''
      },
      currentTime: {
        type: Number,
        default: 0
      },
      playbackRate: {
        type: Number,
        default: 1
      },
      volume: {
        type: Number,
        default: 0.5
      },
      muted: {
        type: Boolean,
        default: false
      },
      metaInfo: {
        type: Object
      }
    }
  },
  components: {
    vueVideoPlayer: videoPlayer
  },
  data () {
    return {
      playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
      events: [
        'ready',
        'waited',
        'play',
        'pause',
        'end',
        'seek',
        'enterfullscreen',
        'exitfullscreen',
        'volumechange',
        'ratechange',
        'switch',
        'close',
        'heartbeat'
      ],
      playerOptions: null
    }
  },
  methods: {
    loadParamsFromOptions () {
      if (this.heartbeat.cancel) {
        this.heartbeat.cancel()
      }
      this.playerOptions = {
        // videojs options
        language: 'en',
        fluid: true,
        autoplay: false,
        playbackRates: this.playbackRates,

        sources: [{
          type: 'video/mp4',
          src: this.options.src
        }],
        poster: this.options.poster
      }
      this.lastEventTime = this.options.currentTime
      this.previousTime = this.options.currentTime
      this.currentTime = this.options.currentTime
      this.playbackRate = this.options.playbackRate
      this.volume = this.options.volume
      this.muted = this.options.muted
      this.fullscreen = false
    },
    heartbeat: debounce(function () {
      if (this.currentTime !== this.lastEventTime) {
        this.emit('heartbeat')
      }
    }, 30000),
    emit (type, props) {
      const event = {
        type,
        currentTime: this.currentTime,
        playbackRate: this.playbackRate,
        volume: this.volume,
        muted: this.muted,
        fullscreen: this.fullscreen,
        waitSince: this.waitSince
      }

      if (this.options.metaInfo) {
        Object.entries(this.options.metaInfo).forEach(([k, v]) => {
          event[k] = v
        })
      }

      if (props) {
        Object.entries(props).forEach(([k, v]) => {
          event[k] = v
        })
      }

      this.lastEventTime = this.currentTime
      this.heartbeat()

      return this.$emit(type, event)
    },
    playerReadied (player) {
      player.on('seeking', this.onSeeking)
      player.on('volumechange', this.onVolumeChange)
      player.on('ratechange', this.onRateChange)
      player.on('fullscreenchange', this.onFullscreenChange)

      player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
        enableVolumeScroll: false,
        customKeys: {
          rightAngle: {
            key: (event) => {
              return event.which === 190
            },
            handler: (player, options, evnet) => {
              player.playbackRate(nextItem(this.playbackRates, player.playbackRate()))
            }
          },
          leftAngle: {
            key: (event) => {
              return event.which === 188
            },
            handler: (player, options, evnet) => {
              player.playbackRate(previousItem(this.playbackRates, player.playbackRate()))
            }
          }
        }
      })

      if (this.options.caption) {
        player.addRemoteTextTrack({
          kind: 'captions',
          label: 'English',
          srclang: 'en',
          src: this.options.caption
        }, false)
      }

      player.volume(this.options.volume)
      player.muted(this.options.muted)
      player.currentTime(Math.floor(this.options.currentTime))
      player.playbackRate(this.options.playbackRate)

      this.emit('ready')
    },
    onPlayerWaiting (player) {
      this.waitSince = Date.now()
    },
    onPlayerTimeupdate (player) {
      this.previousTime = this.currentTime
      this.currentTime = player.currentTime()

      if (this.waitSince) {
        const waitEnd = Date.now()
        if (waitEnd - this.waitSince > 1000) {
          this.emit('waited', {
            waitSince: this.waitSince,
            waitEnd,
            waitLength: waitEnd - this.waitSince
          })
        }
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
      const oldTime = this.previousTime
      const newTime = event.target.player.currentTime()
      this.currentTime = event.target.player.currentTime()

      if (oldTime !== newTime) {
        this.emit('seek', {
          oldTime,
          newTime,
          seekLength: newTime - oldTime
        })
      }
    },
    onFullscreenChange (event) {
      if (event.target.player.isFullscreen()) {
        this.fullscreen = true
        this.emit('enterfullscreen', {
          fullscreen: this.fullscreen
        })
      }
      else {
        this.fullscreen = false
        this.emit('exitfullscreen', {
          fullscreen: this.fullscreen
        })
      }
    },
    onVolumeChange (event) {
      const oldVolume = this.volume
      const oldMuted = this.muted
      this.volume = event.target.player.volume()
      this.muted = event.target.player.muted()

      if (oldVolume !== this.volume || oldMuted !== this.muted) {
        this.emit('volumechange', {
          oldVolume,
          newVolume: this.volume
        })
      }
    },
    onRateChange (event) {
      const oldRate = this.playbackRate
      this.playbackRate = event.target.player.playbackRate()

      if (oldRate !== this.playbackRate) {
        this.emit('ratechange', {
          oldRate,
          newRate: this.playbackRate
        })
      }
    },
    beforeunload () {
      this.emit('close')
    }
  },
  watch: {
    options (newOptions, oldOptions) {
      if (newOptions.src !== oldOptions.src) {
        this.emit('switch', oldOptions.metaInfo)
        this.loadParamsFromOptions()
      }
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.beforeunload)
    this.loadParamsFromOptions()
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.beforeunload)
    if (this.heartbeat.cancel) {
      this.heartbeat.cancel()
    }
  }
}
</script>
