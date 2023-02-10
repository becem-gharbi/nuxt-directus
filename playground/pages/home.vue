<template>
    <div>
        <h1>Home</h1>
        {{ user }}
        <button @click="fetchUser">Fetch user</button>
        <button @click="handleLogout">Logout</button>
        <button @click="fetchItem">Fetch item</button>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" })

const { logout, fetchUser, useUser } = useDirectusAuth()

const user = useUser()

const { $directus } = useNuxtApp()

async function fetchItem() {
    await $directus.items("post").readOne(1)
}

async function handleLogout() {
    const { error } = await logout()
    console.log(error.value?.errors[0])
}
</script>