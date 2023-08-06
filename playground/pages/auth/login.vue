<template>
    <div>
        <h1>Login</h1>
        <button @click="login('becem.gharbi@live.com', 'Becem96')">Login</button>
        <button @click="loginWithProvider('google')">Login with google</button>
        <button @click="requestPasswordReset('becem.gharbi@live.com')">Request password reset</button>
    </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "guest" })

const { login, loginWithProvider, requestPasswordReset } = useDirectusAuth()
</script>