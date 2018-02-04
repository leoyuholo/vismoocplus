<template>
  <q-card inline>
    <q-card-title align="center">
      VisMOOC+
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      <p>
        <q-input v-model="email" align="left" type="email" stack-label="Email" suffix="@connect.ust.hk" @keyup.enter="resetPassword" />
      </p>
      <message :errorMsg="errorMsg" :successMsg="successMsg" />
    </q-card-main>
    <q-card-actions>
      <q-btn color="info" class="full-width" @click="resetPassword">Reset Password</q-btn>
    </q-card-actions>
    <q-card-actions>
      <q-btn flat class="full-width" @click="$router.push({ path: '/' })">Go Back</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import Message from '../widgets/Message'
import { isValidHKUSTEmail, defaultEmailDomain } from '../../helpers'

export default {
  components: {
    Message
  },
  data () {
    return {
      email: '',
      errorMsg: '',
      successMsg: ''
    }
  },
  methods: {
    resetPassword () {
      this.successMsg = ''
      let email = defaultEmailDomain(this.email)

      if (!isValidHKUSTEmail(email)) {
        this.errorMsg = 'Invalid HKUST email address.'
        return
      }

      if (!email) {
        this.errorMsg = 'Missing email.'
        return
      }

      this.$store.dispatch('forgot', { email: this.email })
        .then(() => { this.successMsg = 'Success, please check email.' })
        .catch(error => { this.errorMsg = error.message })
    }
  }
}
</script>
