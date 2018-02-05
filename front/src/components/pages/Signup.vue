<template>
  <q-card inline>
    <q-card-title align="center">
      VisMOOC+
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      <p>
        <q-input v-model="email" align="left" type="email" stack-label="Email" suffix="@connect.ust.hk" @keyup.enter="signup" />
        <q-input v-model="password" type="password" stack-label="Password" @keyup.enter="signup" />
        <q-input v-model="confirmPassword" type="password" stack-label="Confirm Password" @keyup.enter="signup" />
      </p>
      <message :errorMsg="errorMsg" :successMsg="successMsg" />
    </q-card-main>
    <q-card-actions>
      <q-btn color="secondary" class="full-width" @click="signup">Sign Up</q-btn>
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
      password: '',
      confirmPassword: '',
      errorMsg: '',
      successMsg: ''
    }
  },
  methods: {
    signup () {
      this.successMsg = ''
      let email = defaultEmailDomain(this.email)

      if (!isValidHKUSTEmail(email)) {
        this.errorMsg = 'Invalid HKUST email address.'
        return
      }

      if (!email || !this.password) {
        this.errorMsg = 'Missing email/password.'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.errorMsg = 'Password mismatch.'
        return
      }

      this.$store.dispatch('signup', { email, password: this.password })
        .then(() => { this.successMsg = 'Sign Up success, please check email.' })
        .catch(error => { this.errorMsg = error.message })
    }
  }
}
</script>
