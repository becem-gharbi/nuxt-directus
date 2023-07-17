<template>
  <NaiveConfig :theme-config="themeConfig">
    <n-message-provider>
      <NaiveColorModeSwitch />
      <NuxtPage />
    </n-message-provider>
  </NaiveConfig>
</template>

<script setup lang="ts">
import { ThemeConfig } from "@bg-dev/nuxt-naiveui"

const themeConfig: ThemeConfig = {
  shared: {
    common: {
      fontFamily: "Gellix",
    },
  },
}
</script>