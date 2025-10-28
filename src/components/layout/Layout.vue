<!-- src/components/layout/Layout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 py-8">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>