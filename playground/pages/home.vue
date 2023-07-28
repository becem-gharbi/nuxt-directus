<template>
  <div>
    <h1>Home</h1>
    {{ user }}
    <hr>
    {{ result }}
    <hr>
    <button @click="logout()">Logout</button>
    <button @click="refetch()">REFRESH</button>
  </div>
</template>

<script setup lang="ts">
import { graphql } from "~/gql"
import { readItems } from "@directus/sdk"

definePageMeta({ middleware: "auth" })

const { logout, user } = useDirectusAuth()

const { data: books, refresh } = useAsyncData("books", () => useDirectusRest(readItems("book")))

const query = graphql(`
query GetBook {
  book {
    id
  }
}
`)

const subQuery = graphql(`

`
)
const { result, refetch } = useQuery(query)
</script>