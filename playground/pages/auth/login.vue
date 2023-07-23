<template>
    <div>
        <h1>Login</h1>
        <button @click="handleLogin">Login</button>
    </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "guest" })

const { login } = useDirectusAuth()

async function handleLogin() {
    await login({ email: "becem.gharbi@live.com", password: "hello123" })
}
</script>