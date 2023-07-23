<template>
    <div>
        <h1>Home</h1>
        {{ books }}
        <button @click="logout()">Logout</button>
        <button @click="refresh()">REFRESH</button>
    </div>
</template>

<script setup lang="ts">
import { readItems } from "@directus/sdk"

definePageMeta({ middleware: "auth" })

const { logout } = useDirectusAuth()

const { data: books, refresh } = useAsyncData("books", () => useDirectusRest().request(readItems("book")))

</script>