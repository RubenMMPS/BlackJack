<script setup lang="ts">
defineProps<{
  titulo?: string
}>()
</script>

<template>
  <header class="app-header">
    <div class="marca">
      <span class="logo" aria-hidden="true">♠</span>
      <span class="titulo">{{ titulo ?? 'Casino' }}</span>
    </div>

    <!-- Contenido opcional a la derecha (dinero, usuario, menú...) -->
    <div class="derecha">
      <slot />
    </div>
  </header>
</template>

<style scoped src="../assets/appHeader.css"></style>