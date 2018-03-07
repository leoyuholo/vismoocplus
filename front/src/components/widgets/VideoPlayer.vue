<template>
  <div>
    <d-player
      ref="player"
      :options="dPlayerOptions"
      :settings="settings"

      @canplay="oncanplay($event)"
      @pause="onpause($event)"
      @ended="onended($event)"
      @waiting="onwaiting($event)"
      @playing="onplaying($event)"
      @timeupdate="ontimeupdate($event)"
      @seeking="onseeking($event)"
      @volumechange="onvolumechange($event)"
      @ratechange="onratechange($event)"

      @fullscreen="onfullscreen($event)"
      @fullscreen_cancel="onfullscreencancel($event)"

      @ready="onready($event)"
      >
    </d-player>
  </div>
</template>

<script>
import { debounce, capitalize, defaults } from 'lodash'
import VueDPlayer from '@/widgets/DPlayer'

export default {
  name: 'video-player',
  props: {
    video: {
      type: Object,
      default () { return {} }
    },
    settings: {
      type: Object,
      default () { return {} }
    }
  },
  components: {
    'd-player': VueDPlayer
  },
  computed: {
    playerOptions () {
      const playerOptions = defaults({}, this.video, {
        src: '',
        poster: '',
        caption: '',
        tracking: {}
      })

      return playerOptions
    },
    dPlayerOptions () {
      return {
        video: {
          url: this.playerOptions.src,
          pic: this.playerOptions.poster
        },
        subtitle: {
          url: this.playerOptions.caption,
          fontSize: '1.5vw',
          bottom: '10%'
        }
      }
    },
    playerSettings () {
      const settings = defaults({}, this.settings, {
        currentTime: 0,
        playbackRate: 1,
        volume: 0.5,
        meted: false
      })

      return settings
    }
  },
  methods: {
    duration () {
      return this.$refs.player.dp.video.duration
    },
    init () {
      if (this.heartbeat.cancel) {
        this.heartbeat.cancel()
      }

      this.lastEventTime = this.previousTime = this.currentTime = this.playerSettings.currentTime
      this.playbackRate = this.playerSettings.playbackRate
      this.volume = this.playerSettings.volume
      this.muted = this.playerSettings.muted
      this.fullscreen = false
      this.waitSince = undefined
    },
    heartbeat: debounce(function () {
      if (this.currentTime !== this.lastEventTime) {
        this.emit('heartbeat', {
          lastEventTime: this.lastEventTime,
          currentTime: this.currentTime
        })
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

      if (this.playerOptions.tracking && this.playerOptions.tracking.dimensions) {
        Object.entries(this.video.tracking.dimensions).forEach(([k, v]) => {
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

      console.debug(type, event)

      return this.$emit(type, event)
    },
    oncanplay (player) {
      this.emit('canplay')
    },
    onwaiting (player) {
      this.waitSince = Date.now()
    },
    onplaying (player) {
      this.previousTime = this.currentTime
      this.currentTime = player.video.currentTime

      this.emit('play')
    },
    onpause (player) {
      this.previousTime = this.currentTime
      this.currentTime = player.video.currentTime

      this.emit('pause')
    },
    onended (player) {
      this.previousTime = this.currentTime
      this.currentTime = player.video.currentTime

      this.emit('end')
    },
    ontimeupdate (player) {
      this.previousTime = this.currentTime
      this.currentTime = player.video.currentTime

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
    onseeking (player) {
      const oldTime = this.previousTime
      const newTime = player.video.currentTime
      this.currentTime = player.video.currentTime

      if (oldTime !== newTime) {
        this.emit('seek', {
          oldTime,
          newTime,
          seekLength: newTime - oldTime
        })
      }
    },
    onvolumechange (player) {
      const oldVolume = this.volume
      const oldMuted = this.muted
      this.volume = +player.video.volume.toFixed(2)
      this.muted = player.video.muted

      if (oldVolume !== this.volume || oldMuted !== this.muted) {
        this.emit('volumechange', {
          oldVolume,
          newVolume: this.volume,
          oldMuted,
          newMuted: this.muted
        })
      }
    },
    onratechange (player) {
      const oldRate = this.playbackRate
      this.playbackRate = player.video.playbackRate

      if (oldRate !== this.playbackRate) {
        this.emit('ratechange', {
          oldRate,
          newRate: this.playbackRate
        })
      }
    },
    onfullscreen (player) {
      this.fullscreen = true
      this.emit('enterfullscreen', {
        fullscreen: this.fullscreen
      })
    },
    onfullscreencancel (player) {
      this.fullscreen = false
      this.emit('exitfullscreen', {
        fullscreen: this.fullscreen
      })
    },
    onready (player) {
      this.emit('ready')
    },
    beforeunload () {
      this.emit('close')
    }
  },
  watch: {
    video (newVideo, oldVideo) {
      const event = {}

      if (oldVideo.tracking && oldVideo.tracking.dimensions) {
        Object.entries(oldVideo.tracking.dimensions).forEach(([k, v]) => {
          event['old' + capitalize(k)] = v
        })
      }

      if (newVideo.tracking && newVideo.tracking.dimensions) {
        Object.entries(newVideo.tracking.dimensions).forEach(([k, v]) => {
          event['new' + capitalize(k)] = v
        })
      }

      this.emit('switch', event)
      this.init()
    }
  },
  mounted () {
    window.addEventListener('beforeunload', this.beforeunload)
    this.init()
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.beforeunload)
    if (this.heartbeat.cancel) {
      this.heartbeat.cancel()
    }
  }
}
</script>
