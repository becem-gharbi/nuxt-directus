<template>
  <ion-page>
    <ion-content>
      <h1>Home</h1>
      <p data-testid="user-data">
        {{ user }}
      </p>
      <button @click="fetchUser()">
        Fetch user
      </button>
      <button @click="logout()">
        Logout
      </button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useDirectusAuth } from '#imports'

const { logout, user, fetchUser } = useDirectusAuth()
</script>
