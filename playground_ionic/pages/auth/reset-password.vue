<template>
  <ion-page>
    <ion-content>
      <h1>Reset password</h1>
      <label>Password:</label>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
      >
      <button @click="resetPassword(password)">
        Reset password
      </button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { definePageMeta, useDirectusAuth, ref } from '#imports'

definePageMeta({ middleware: 'guest' })

const { resetPassword } = useDirectusAuth()

const password = ref()
</script>
