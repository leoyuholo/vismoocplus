<template>
  <div>
    <vue-video-player  class="video-player-box"
                   ref="videoPlayer"
                   :options="playerOptions"
                   :playsinline="true"
                   customEventName="customstatechangedeventname"

                   @play="onPlayerPlay($event)"
                   @pause="onPlayerPause($event)"
                   @ended="onPlayerEnded($event)"
                   @waiting="onPlayerWaiting($event)"
                   @playing="onPlayerPlaying($event)"
                   @loadeddata="onPlayerLoadeddata($event)"
                   @timeupdate="onPlayerTimeupdate($event)"
                   @canplay="onPlayerCanplay($event)"
                   @canplaythrough="onPlayerCanplaythrough($event)"

                   @statechanged="playerStateChanged($event)"
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
    return {}
  },
  computed: {
    playerOptions () {
      // console.log('options', this.options)
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
    onPlayerPlay (player) {
      // console.log('player play!', player)
    },
    onPlayerPause (player) {
      // console.log('player pause!', player)
    },
    onPlayerEnded (player) {
      // console.log('player end!', player)
    },
    onPlayerWaiting (player) {
      // console.log('player Waiting!', player)
    },
    onPlayerPlaying (player) {
      // console.log('player Playing!', player)
    },
    onPlayerLoadeddata (player) {
      // console.log('player Loadeddata!', player)
    },
    onPlayerTimeupdate (player) {
      // console.log('player Timeupdate!', player)
    },
    onPlayerCanplay (player) {
      // console.log('player Canplay!', player)
    },
    onPlayerCanplaythrough (player) {
      // console.log('player Canplaythrough!', player)
    },
    playerStateChanged (playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    playerReadied (player) {
      // console.log('the player is readied', player)
    }
  },
  mounted () {
    // console.log('mounted')
  },
  beforeDestroy () {
    // console.log('beforeDestroy')
  }
}
</script>
