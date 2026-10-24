<script setup lang="ts">
import { computed } from 'vue'
import { desglosarApuesta } from '../utils/fichas'

const props = defineProps<{
  cantidad: number
}>()

const MAX_VISIBLES = 4

const grupos = computed(() => desglosarApuesta(props.cantidad))

function visibles(cantidad: number) {
  return Math.min(cantidad, MAX_VISIBLES)
}

function etiqueta(valor: number) {
  return valor >= 1000 ? `${valor / 1000}K` : String(valor)
}
</script>

<template>
  <div class="fichas" role="img" :aria-label="`Apuesta de ${cantidad} euros`">
    <div
      v-for="g in grupos"
      :key="g.tipo.valor"
      class="pila"
      :style="{ '--n': visibles(g.cantidad) }"
      :title="`${g.cantidad} × ${g.tipo.valor}€`"
    >
      <div
        v-for="i in visibles(g.cantidad)"
        :key="i"
        class="ficha"
        :style="{
          '--i': i,
          '--color': g.tipo.color,
          '--borde': g.tipo.borde,
          '--texto': g.tipo.texto
        }"
      >

        <span v-if="i === visibles(g.cantidad)">{{ etiqueta(g.tipo.valor) }}</span>
      </div>
      <span v-if="g.cantidad > 1" class="cantidad">×{{ g.cantidad }}</span>
    </div>
  </div>
</template>

<style scoped src="../assets/fichasApuesta.css"></style>