<template>
    <NuxtLayout>
        <UserCard></UserCard>
        <hr>
        {{ books }}
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { readItems } from "@directus/sdk"

definePageMeta({
    middleware: "auth",
    layout: "auth"
})

const { data: books } = useAsyncData(() => useDirectusRest(readItems("book", { fields: ["author"] })))
</script>