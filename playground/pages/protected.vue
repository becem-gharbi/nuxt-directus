<template>
    <h1>Protected route</h1>
</template>

<script setup>
definePageMeta({
    middleware: "auth"
})
</script>