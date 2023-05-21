<template>
    <div>
        <h1>Login</h1>
        <button @click="handleLogin">Login</button>
        <button @click="handleRequestPasswordReset">Forgot password</button>
        <button @click="() => loginWithProvider({ provider: 'google' })">Login with google</button>
    </div>
</template>

<script setup lang="ts">

definePageMeta({ middleware: "guest" })

const { login, requestPasswordReset, loginWithProvider } = useDirectusAuth()


async function handleLogin() {
    const { data, error } = await login({ email: "becem.gharbi@live.com", password: "hello123" })
    console.log("data ", data.value?.access_token)
    console.log("error", error.value?.errors[0].message)
}

async function handleRequestPasswordReset() {
    const { error } = await requestPasswordReset("becem.gharbi@live.com")
    console.error(error.value?.errors[0].message)
}
</script>