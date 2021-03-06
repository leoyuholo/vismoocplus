// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar, {
  QBtn,
  QIcon,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QList,
  QListHeader,
  QSideLink,
  QItemSide,
  QItemMain,
  QField,
  QInput,
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QCardActions,
  QDatetime,
  QVideo
} from 'quasar'

Vue.config.productionTip = false
Vue.use(Quasar, {
  components: {
    QBtn,
    QIcon,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QList,
    QListHeader,
    QSideLink,
    QItemSide,
    QItemMain,
    QField,
    QInput,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QCardActions,
    QDatetime,
    QVideo
  }
})

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

import router from './router'
import store from './store'

// router store sync
import { sync } from 'vuex-router-sync'
sync(store, router)

// form validation
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

// page view analysis
import VueAnalytics from 'vue-analytics'
const analytics = process.env.analytics
if (analytics && (!analytics.debug || analytics.debug.enabled)) {
  Vue.use(VueAnalytics, {
    id: analytics.id,
    debug: analytics.debug || {},
    autoTracking: {
      exception: true
    },
    router
  })
}

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    store,
    router,
    render: h => h(require('./App').default),
    created () {
      return this.$store.dispatch('init')
    }
  })
})
