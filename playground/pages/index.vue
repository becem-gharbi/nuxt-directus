<template>
  <div>
    <h1>Index</h1>
    <NuxtLink to="/auth/login">
      Login
    </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'guest' })
</script>
