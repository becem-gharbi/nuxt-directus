<template>
  <div>
    <h1>Login</h1>
    <div>
      <label>E-Mail:</label>
      <input v-model="email" type="email" placeholder="Email">
    </div>
    <div>
      <label>Password:</label>
      <input v-model="password" type="password" placeholder="Password">
    </div>

    <div>
      <button @click="login(email, password)">
        Login
      </button>
      <button @click="loginWithProvider('google')">
        Login with google
      </button>
      <button @click="requestPasswordReset('becem.gharbi@live.com')">
        Request password reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useDirectusAuth, ref } from '#imports'

definePageMeta({ middleware: 'guest' })

const { login, loginWithProvider, requestPasswordReset } = useDirectusAuth()

const email = ref('tester@test.com')
const password = ref('test123')
</script>

<style scoped>
div {
  margin-top: 1rem;
}

button + button,
input {
  margin-left: 0.5rem;
}

</style>
