<template>
    <NuxtLayout>
        <UserCard></UserCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { readItems } from "@directus/sdk/dist/rest"

definePageMeta({
    middleware: "auth",
    layout: "auth"
})

const { } = useAsyncData(() => useDirectusRest())
</script>