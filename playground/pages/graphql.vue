<template>
  <div>
    <h1>GraphQL</h1>
    <p>{{ counter }}</p>
    <button
      v-if="config.public.directus.auth.mode ==='session'"
      @click="refresh()"
    >
      Refresh
    </button>
    <button
      @click="increment()"
    >
      Increment
    </button>
  </div>
</template>

<script setup>
import {
  computed,
  gql,
  useMutation,
  useLazyQuery,
  useSubscription,
  useAsyncData,
  useRuntimeConfig,
} from '#imports'

const config = useRuntimeConfig()

const query = useLazyQuery(gql`
    query GetCounter { counter { value}}
`)

const { data: initial, refresh } = await useAsyncData(
  async () => query.load() || query.refetch(),
)

const { result: updated } = useSubscription(
  gql(`
    subscription SubscribeCounter {counter_mutated {data {value}}}
`),
)

const counter = computed(
  () =>
    updated?.value?.counter_mutated?.data?.value
    ?? initial?.value?.counter?.value
    ?? initial?.value?.data?.counter?.value,
)

const { mutate } = useMutation(
  gql(`
        mutation UpdateCounter($value: Int) {
          update_counter(data: {value:$value}) {value}
        }`,
  ))

function increment() {
  if (counter.value) {
    mutate({ value: counter.value + 1 })
  }
}
</script>
