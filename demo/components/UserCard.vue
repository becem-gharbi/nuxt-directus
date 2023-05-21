<template>
    <n-card>
        <template #header>
            <NaiveIcon name="fluent-emoji-flat:clapping-hands" :size="36"></NaiveIcon>
            {{ "Welcome " + user?.first_name + " " + user?.last_name }}
        </template>

        <div class="flex flex-col align-middle">
            <p>{{ 'Provider: ' + user?.provider }}</p>

            <p>{{ 'Last access: ' + new Date(user?.last_access!).toLocaleString() }}</p>
        </div>

        <template #footer>
            <n-button class="float-right" @click="logout">Logout</n-button>
        </template>
    </n-card>
</template>

<script setup lang="ts">
const { useUser, logout } = useDirectusAuth()
const user = useUser().value
</script>