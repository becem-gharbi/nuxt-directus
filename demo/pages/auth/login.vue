<template>
    <NuxtLayout>
        <n-card>
            <n-form ref="formRef" :rules="rules" :model="model" @submit.prevent="onSubmit(handleSubmit)">
                <n-form-item label="Email" path="email" :show-require-mark="false">
                    <n-input v-model:value="model.email"></n-input>
                </n-form-item>

                <n-form-item path="password" label="Password" :show-require-mark="false">
                    <n-input v-model:value="model.password" type="password"></n-input>
                </n-form-item>

                <div class="grid grid-cols-1 gap-4">
                    <NuxtLink to="/auth/request-password-reset" class="no-underline">
                        <n-text type="primary">Forgot password?</n-text>
                    </NuxtLink>
                    <n-button attr-type="submit" block :loading="pending" :disabled="pending" type="primary">Login</n-button>
                    <n-button @click="loginWithProvider({ provider: 'google' })" block>
                        <template #icon>
                            <NaiveIcon name="logos:google-icon"></NaiveIcon>
                        </template>
                        Continue with Google
                    </n-button>
                </div>
            </n-form>
        </n-card>

        <n-card class="text-center">
            Do not have account?
            <NuxtLink to="/auth/register" class="no-underline">
                <n-text type="primary"> Create one</n-text>
            </NuxtLink>
        </n-card>
    </NuxtLayout>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: "guest",
    layout: "auth"
})

const { formRef, rules, pending, apiErrors, onSubmit } = useNaiveForm()
const { login, loginWithProvider } = useDirectusAuth()

const model = ref({
    email: "",
    password: "",
});

apiErrors.value = {
    wrongCredentials: false,
    invalidProvider: false
}

rules.value = {
    email: [
        {
            required: true,
            message: "Please input your email",
            trigger: "blur",
        },
        {
            message: "Wrong credentials",
            validator: () => !apiErrors.value.wrongCredentials
        },
        {
            message: "You are using a different provider",
            validator: () => !apiErrors.value.invalidProvider
        }
    ],
    password: [
        {
            required: true,
            message: "Please input your password",
            trigger: "blur",
        },
    ],
}

async function handleSubmit() {
    const { error } = await login({
        email: model.value.email,
        password: model.value.password
    });

    if (error.value) {
        apiErrors.value.wrongCredentials = error.value.errors.some(e => e.message === "Invalid user credentials.")
        apiErrors.value.invalidProvider = error.value.errors.some(e => e.message === "Invalid provider.")
    }
}
</script>