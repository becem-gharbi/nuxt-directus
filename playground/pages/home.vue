<template>
  <div>
    <h3>Home</h3>
    <p>{{ user }}</p>
    <button @click="logout()">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDirectusAuth } from '#imports'

const { logout, user } = useDirectusAuth()
</script>
