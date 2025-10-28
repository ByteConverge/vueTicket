<!-- src/App.vue -->
<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
// App initialization can go here if needed
</script>

<style>
/* Ensure global styles are applied */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>