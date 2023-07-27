<template>
    <NuxtLayout>
        <UserCard></UserCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { readItems } from "@directus/sdk"

definePageMeta({
    middleware: "auth",
    layout: "auth"
})
</script>