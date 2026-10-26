<script setup lang="ts">
import { useDineroStore } from '../stores/dinero'

defineProps<{
  titulo?: string
}>()

const banca = useDineroStore()
</script>

<template>
  <header class="app-header">
    <div class="marca">
      <span class="logo" aria-hidden="true">♠</span>
      <span class="titulo">{{ titulo ?? 'Casino' }}</span>
    </div>

    <!-- Aquí irá la navegación entre juegos -->
    <nav class="nav">
      <RouterLink to="/blackjack" class="nav-link" active-class="active">BlackJack</RouterLink>
      <RouterLink to="/carreraCaballos" class="nav-link" active-class="active">Carrera de Caballos</RouterLink>
    </nav>

    <button class="reinicio-dinero" v-if="banca.dinero == 0" @click="banca.reiniciar">Reiniciar dinero</button>

    <div class="dinero">
      <span class="dinero-etiqueta">Saldo</span>
      <span class="dinero-valor">{{ banca.dinero }}€</span>
    </div>
  </header>
</template>

<style scoped src="../assets/appHeader.css"></style>