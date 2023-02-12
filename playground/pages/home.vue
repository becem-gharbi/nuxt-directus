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
    const Author = directus.items("author")

    const authors = await Author.readByQuery({
        fields: "*.translations",
        deep: {
            posts: {
                translations: {
                    _filter: {
                        languages_id: { _eq: "fr-FR" }
                    }
                }
            }
        },
    })

    console.log(authors)
}

async function handleLogout() {
    const { error } = await logout()
    console.log(error.value?.errors[0])
}
</script>