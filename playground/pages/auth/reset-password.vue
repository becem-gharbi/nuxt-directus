<template>
    <div>
        <h1>Reset password</h1>
        <button @click="handleResetPassword">Reset password</button>
    </div>
</template>

<script setup>
definePageMeta({ middleware: "guest" })

const { resetPassword } = useDirectusAuth()

async function handleResetPassword() {
    const { error } = await resetPassword("abc123")
    console.log(error.value.errors[0].message)
}

</script>