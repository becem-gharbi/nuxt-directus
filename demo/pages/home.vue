<template>
    <NuxtLayout>
        <UserCard></UserCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
// import { graphql } from "~/gql"

definePageMeta({
    middleware: "auth",
    layout: "auth"
})
// const query = graphql(`
// subscription BookSub {
//     book_mutated {
//         key
//         event
//         data{
//             author
//             id
//         }
//     }
// }
// `)

// const { result } = useSubscription(query)

</script>