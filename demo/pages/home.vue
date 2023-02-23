<template>
    <NuxtLayout>
        <UserCard></UserCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: "auth",
    layout: "auth"
})
</script>