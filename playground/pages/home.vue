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

const directus = useDirectus();

async function fetchItem() {
    const Book = directus.items("book")

    const authors = await Book.readByQuery()
}

async function handleLogout() {
    const { error } = await logout()
    console.log(error.value?.errors[0])
}

const users = await directus.items("directus_users").readByQuery({
    fields: [
        'email',
        'first_name',
        'last_name',
        'id',
    ],
    filter: {
        _and: [
            {
                first_name: "Admin"
            }, {
                provider: {
                    _eq: "default"
                }
            }
        ]
    }
})
</script>