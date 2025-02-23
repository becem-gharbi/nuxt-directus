<template>
  <ion-page>
    <ion-content>
      <h1>Index</h1>
      <nuxt-link to="/auth/login">
        Login
      </nuxt-link>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { definePageMeta } from '#imports'

definePageMeta({ middleware: 'guest' })
</script>
