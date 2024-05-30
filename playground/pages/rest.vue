<template>
  <div>
    <h1>Rest</h1>
    <p>{{ data }}</p>
    <button @click="refresh()">
      Refresh
    </button>
  </div>
</template>

<script setup>
import { useDirectusRest, readItems, useAsyncData } from '#imports'

const { data, refresh } = await useAsyncData(() =>
  useDirectusRest(readItems('country')),
)
</script>
