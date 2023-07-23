<template>
    <div>
        <h1>Home</h1>
        <button @click="handleLogout">Logout</button>
        <button @click="fetchItem">Fetch item</button>
    </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "auth" })

const { logout } = useDirectusAuth()

async function fetchItem() {
}

async function handleLogout() {
    await logout()
}
</script>