<template>
  <q-card inline>
    <q-card-title align="center">
      VisMOOC+
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      <p>
        <q-input v-model="email" align="left" type="email" stack-label="Email" suffix="@connect.ust.hk" @keyup.enter="login" />
        <q-input v-model="password" type="password" stack-label="Password" @keyup.enter="login" />
      </p>
      <message :errorMsg="errorMsg" :successMsg="successMsg" />
      <!-- <router-link class="pull-left" to="/user/resend">Verify Email</router-link> -->
      <router-link class="pull-right" to="/user/forgot">Forgot Password</router-link>
      <br/>
    </q-card-main>
    <q-card-actions>
      <q-btn color="primary" class="full-width" @click="login">Log In</q-btn>
    </q-card-actions>
    <q-card-actions>
      <q-btn flat class="full-width" @click="$router.push({ path: '/user/signup' })">Sign Up</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { get } from 'lodash'
import { isValidHKUSTEmail, defaultEmailDomain } from 'src/helpers'
import Message from '@/widgets/Message'

export default {
  components: {
    Message
  },
  data () {
    return {
      email: '',
      password: '',
      errorMsg: get(this.$route, ['query', 'error_msg'], ''),
      successMsg: get(this.$route, ['query', 'success_msg'], '')
    }
  },
  methods: {
    login () {
      this.errorMsg = ''
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

      this.$store.dispatch('user/login', { email, password: this.password })
        .then(() => this.$router.push({ path: this.$route.query.redirect_from || '/course/COMP4901F/lecture/index' }))
        .catch(error => { this.errorMsg = error.message })
    }
  }
}
</script>
