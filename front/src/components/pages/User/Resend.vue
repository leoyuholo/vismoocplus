<template>
  <q-card inline>
    <q-card-title align="center">
      VisMOOC+
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      <p>
        <q-input v-model="email" align="left" type="email" stack-label="Email" suffix="@connect.ust.hk" @keyup.enter="resend" />
      </p>
      <message :errorMsg="errorMsg" :successMsg="successMsg" />
    </q-card-main>
    <q-card-actions>
      <q-btn color="info" class="full-width" @click="resend">Resend Verification</q-btn>
    </q-card-actions>
    <q-card-actions>
      <q-btn flat class="full-width" @click="$router.push({ path: '/' })">Go Back</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import get from 'lodash/get'
import { isValidHKUSTEmail, defaultEmailDomain } from 'src/helpers'
import Message from '@/widgets/Message'

export default {
  components: {
    Message
  },
  data () {
    return {
      email: get(this.$route, ['query', 'email'], ''),
      errorMsg: '',
      successMsg: ''
    }
  },
  methods: {
    resend () {
      this.errorMsg = ''
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

      this.$store.dispatch('user/resend', { email })
        .then(() => { this.successMsg = 'Success, please check email.' })
        .catch(error => { this.errorMsg = error.message })
    }
  }
}
</script>
