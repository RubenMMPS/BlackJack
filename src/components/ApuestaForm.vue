<script setup lang="ts">
import { ref } from 'vue'
import { useDineroStore } from '../stores/dinero'

defineProps<{ error?: string }>()
const emit = defineEmits<{ (e: 'apostar', cantidad: number): void }>()

const banca = useDineroStore()
const apuestaInput = ref(0)
</script>

<template>
  <div class="apuesta-form">
    <p v-if="error" class="error">{{ error }}</p>
    <p><slot>Realiza una apuesta para comenzar el juego.</slot></p>
    <div class="fila">
      <input
        type="number"
        v-model.number="apuestaInput"
        min="1"
        :max="banca.dinero"
        placeholder="Cantidad a apostar"
        @keyup.enter="emit('apostar', apuestaInput)"
      />
      <button class="btn" @click="emit('apostar', apuestaInput)">Apostar</button>
    </div>
  </div>
</template>

<style scoped src="../assets/blackjack.css"></style>