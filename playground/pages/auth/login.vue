<template>
  <div>
    <h1>Login</h1>
    <div>
      <label>Email:</label>
      <input
        v-model="email"
        type="email"
        placeholder="email"
      >
    </div>
    <div>
      <label>Password:</label>
      <input
        v-model="password"
        type="password"
        placeholder="password"
      >
    </div>

    <div>
      <button @click="login(email, password)">
        Login
      </button>
      <button @click="loginWithProvider('google')">
        Login with google
      </button>
      <button @click="requestPasswordReset(email)">
        Request password reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDirectusAuth, ref } from '#imports'

const { login, loginWithProvider, requestPasswordReset } = useDirectusAuth()

const email = ref()
const password = ref()
</script>
