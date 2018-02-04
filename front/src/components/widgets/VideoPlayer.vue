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
import 'videojs-hotkeys'
import { nextItem, previousItem } from '../../helpers'

export default {
  name: 'video-player',
  props: ['options'],
  components: {
    vueVideoPlayer: videoPlayer
  },
  data () {
    return {
      currentTime: 0,
      volume: 0.5,
      playbackRate: 1,
      playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
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

      return this.$emit(type, event)
    },
    playerReadied (player) {
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

      if (this.options.volume !== undefined) {
        player.volume(this.options.volume)
        this.programVolumeChange = true
      }

      if (this.options.currentTime !== undefined) {
        player.currentTime(this.options.currentTime)
        this.programSeek = true
      }

      if (this.options.playbackRate !== undefined) {
        player.playbackRate(this.options.playbackRate)
        this.programPlaybackRate = true
      }

      this.currentTime = player.currentTime()
      this.volume = player.volume()
      this.playbackRate = player.playbackRate()
      this.fullscreen = player.isFullscreen()

      player.on('seeking', this.onSeeking)
      player.on('volumechange', this.onVolumeChange)
      player.on('ratechange', this.onRateChange)
      player.on('fullscreenchange', this.onFullscreenChange)

      this.emit('ready')
    },
    onPlayerWaiting (player) {
      this.waitSince = Date.now()
    },
    onPlayerTimeupdate (player) {
      this.currentTime = player.currentTime()

      if (this.waitSince) {
        const waitEnd = Date.now()
        if (waitEnd - this.waitSince > 1000) {
          this.emit('waited', {
            waitSince: this.waitSince,
            waitEnd: Date.now()
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
      if (this.programSeek) {
        this.programSeek = false
        return
      }
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
    onVolumeChange (event) {
      if (this.programVolumeChange) {
        this.programVolumeChange = false
        return
      }
      const newVolume = event.target.player.volume()
      this.emit('volumechange', {
        oldVolume: this.volume,
        newVolume
      })
      this.volume = newVolume
    },
    onRateChange (event) {
      if (this.programPlaybackRate) {
        this.programPlaybackRate = false
        return
      }
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
        this.emit('quit', oldOptions.metaInfo)
      }
    }
  },
  beforeDestroy () {
    this.emit('quit')
  }
}
</script>
