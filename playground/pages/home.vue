<template>
  <div>
    <h3>Auth</h3>
    <p>{{ user }}</p>
    <button @click="logout()">Logout</button>
    <hr />

    <h3>Rest</h3>
    <p>{{ data }}</p>
    <button @click="refresh()">REFRESH</button>

    <hr />
    <h3>GraphQL</h3>
    <p>{{ dataQL }}</p>
    <button @click="refreshQL()">refreshQL</button>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useLazyQuery, gql, useDirectusAuth, useDirectusRest, readItems, useAsyncData } from '#imports'

definePageMeta({ middleware: "auth" });

const { load, refetch } = useLazyQuery(gql`
  query getCountries {
    country {
      id
      name
    }
  }
`);

const { logout, user } = useDirectusAuth();

const { data, refresh } = await useAsyncData(() =>
  useDirectusRest(readItems("country"))
);

const { data: dataQL, refresh: refreshQL } = await useAsyncData(
  async () => load() || refetch()
);
</script>
