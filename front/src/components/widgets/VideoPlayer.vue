<template>
  <div>
    <vue-video-player
      class="video-player-box"
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
import 'videojs-hotkeys'
import { debounce } from 'lodash'
import { nextItem, previousItem } from '../../helpers'

export default {
  name: 'video-player',
  props: ['options'],
  components: {
    vueVideoPlayer: videoPlayer
  },
  data () {
    return {
      fullscreen: false,
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
        'quit',
        'switch',
        'close',
        'heartbeat'
      ]
    }
  },
  computed: {
    playerOptions () {
      return {
        // videojs options
        language: 'en',
        fluid: true,
        playbackRates: this.playbackRates,

        sources: [{
          type: 'video/mp4',
          src: this.options.src
        }],
        poster: this.options.poster,

        autoplay: this.options.autoplay || false,
        muted: this.options.muted || false
      }
    }
  },
  methods: {
    loadParamsFromOptions () {
      this.previousTime = this.options.currentTime || 0
      this.currentTime = this.options.currentTime || 0
      this.playbackRate = this.options.playbackRate || 1
      this.volume = this.options.volume || 0.5
      this.muted = this.options.muted || false
    },
    heartbeat: debounce((emit) => { emit('heartbeat') }, 10000),
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

      this.heartbeat(this.emit)

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

      player.volume(this.volume)
      player.muted(this.muted)
      player.currentTime(this.currentTime)
      player.playbackRate(this.playbackRate)

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
        this.emit('enterfullscreen')
      }
      else {
        this.fullscreen = false
        this.emit('exitfullscreen')
      }
    },
    onVolumeChange (event) {
      const newVolume = event.target.player.volume()
      const muted = event.target.player.muted()

      if (this.volume !== newVolume || this.muted !== muted) {
        this.emit('volumechange', {
          oldVolume: this.volume,
          newVolume,
          muted
        })
      }

      this.volume = newVolume
      this.muted = muted
    },
    onRateChange (event) {
      const newRate = event.target.player.playbackRate()

      if (this.playbackRate !== newRate) {
        this.emit('ratechange', {
          oldRate: this.playbackRate,
          newRate
        })
      }

      this.playbackRate = newRate
    },
    beforeunload () {
      this.emit('close')
    }
  },
  watch: {
    options (newOptions, oldOptions) {
      if (newOptions.src !== oldOptions.src) {
        this.emit('switch', oldOptions.metaInfo)
      }
      this.loadParamsFromOptions()
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.beforeunload)
    this.loadParamsFromOptions()
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.beforeunload)
    this.emit('quit')
  }
}
</script>
