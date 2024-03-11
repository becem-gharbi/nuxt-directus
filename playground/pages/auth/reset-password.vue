<template>
  <div>
    <h1>Reset password</h1>
    <button @click="resetPassword('pass123')">
      Reset password
    </button>
  </div>
</template>

<script setup>
import { definePageMeta, useDirectusAuth } from '#imports'

definePageMeta({ middleware: 'guest' })

const { resetPassword } = useDirectusAuth()
</script>
