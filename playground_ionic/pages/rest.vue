<template>
  <ion-page>
    <ion-content>
      <h1>Rest</h1>
      <p data-testid="rest-data">
        {{ data }}
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { useDirectusRest, readItems, useAsyncData } from '#imports'

const { data } = await useAsyncData(() =>
  useDirectusRest(readItems('country')),
)
</script>
