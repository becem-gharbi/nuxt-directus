<template>
  <NaiveConfig :theme-config="themeConfig">
    <n-message-provider>

      <NaiveColorModeSwitch />

      <p>{{ dependencies["@bg-dev/nuxt-directus"] }}</p>

      <NuxtPage />

    </n-message-provider>
  </NaiveConfig>
</template>

<script setup lang="ts">
import { dependencies } from "./package.json"
import { ThemeConfig } from "@bg-dev/nuxt-naiveui"

const themeConfig: ThemeConfig = {
  shared: {
    common: {
      fontFamily: "Gellix",
    },
  },
}
</script>