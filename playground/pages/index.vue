<template>
    <div>
        <h1>Index</h1>
        <p>{{ books }}</p>
        <!-- <NuxtLink to="/auth/login">Login</NuxtLink>
        <NuxtLink to="/auth/register">Register</NuxtLink> -->
    </div>
</template>

<script setup>
import { readItems } from "@directus/sdk"

// definePageMeta({ middleware: "guest" })

const { data: books } = useAsyncData("books",
    () => useDirectusRest().request(readItems("book")),
    { server: false }
)
</script>