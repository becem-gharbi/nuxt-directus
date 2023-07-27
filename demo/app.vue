<template>
  <NaiveConfig :theme-config="themeConfig">
    <n-message-provider>

      <div class="flex gap-4 m-4 px-4 shadow-sm">
        <NaiveColorModeSwitch />
        <p>{{ dependencies["@bg-dev/nuxt-directus"] }}</p>
      </div>


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