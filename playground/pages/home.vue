<template>
    <div>
        <h1>Home</h1>
        {{ user }}
        <hr>
        {{ result }}
        <hr>
        <button @click="logout()">Logout</button>
        <button @click="refresh()">REFRESH</button>
    </div>
</template>

<script setup lang="ts">
import { readItems } from "@directus/sdk"

definePageMeta({ middleware: "auth" })

const { logout, user } = useDirectusAuth()

const { data: books, refresh } = useAsyncData("books", () => useDirectusRest(readItems("book")))

const { result } = useQuery(gql`
query Book{
  book  {
    id
     name
     author
  }
}
`)

</script>