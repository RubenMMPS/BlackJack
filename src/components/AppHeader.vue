<script setup lang="ts">
import { useDineroStore } from '../stores/dinero'

const banca = useDineroStore()
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="marca-link">
      <div class="marca">
        <span class="logo" aria-hidden="true">♠</span>
        <span class="titulo">Casino</span>
      </div>
    </RouterLink>

    <nav class="nav">
      <slot name="nav" />
    </nav>

    <button class="reinicio-dinero" v-if="banca.dinero == 0" @click="banca.reiniciar">Reiniciar dinero</button>

    <div class="dinero">
      <span class="dinero-etiqueta">Saldo</span>
      <span class="dinero-valor">{{ banca.dinero }}€</span>
    </div>
  </header>
</template>

<style scoped src="../assets/appHeader.css"></style>