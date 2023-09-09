<template>
  <div>
    <h1>Home</h1>
    {{ user }}
    <hr>
    {{ data }}
    <hr>
    <button @click="logout()">
      Logout
    </button>
    <button @click="refresh()">
      REFRESH
    </button>
  </div>
</template>

<script setup lang="ts">
import { readItems } from '@directus/sdk'
import { graphql } from '~/gql'

definePageMeta({ middleware: 'auth' })

const { logout, user } = useDirectusAuth()

const { data, refresh } = await useAsyncData('country', () => useDirectusRest(readItems('country')))

// const query = graphql(`
// query GetBook {
//   book {
//     id
//   }
// }
// `)

// const subQuery = gql`
// subscription SubBook {
//   book_mutated {
//     data {
//       name
//     }
//   }
// }
// `

// const { result: subResult } = useSubscription(subQuery)

// const { result, refetch } = useQuery(query)
</script>
