<template>
  <div>
    <h1>Index</h1>
    <nuxt-link to="/auth/login">
      Login
    </nuxt-link>
  </div>
</template>

<script setup>
import { definePageMeta } from '#imports'

definePageMeta({ middleware: 'guest' })
</script>
