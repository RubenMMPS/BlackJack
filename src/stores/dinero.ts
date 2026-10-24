import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const CLAVE = 'casino-dinero'
const DINERO_INICIAL = 1000

function cargarDinero(): number {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado !== null) {
      const n = Number(guardado)
      if (Number.isFinite(n) && n >= 0) return n
    }
  } catch {
    // ignorar
  }
  return DINERO_INICIAL
}

export const useDineroStore = defineStore('dinero', () => {
  const dinero = ref(cargarDinero())

  watch(dinero, (nuevo) => {
    try {
      localStorage.setItem(CLAVE, String(nuevo))
    } catch {
      // ignorar
    }
  })

  /** Resta dinero. Devuelve false si no hay saldo suficiente. */
  function restar(cantidad: number): boolean {
    if (cantidad <= 0 || cantidad > dinero.value) return false
    dinero.value -= cantidad
    return true
  }

  function sumar(cantidad: number) {
    if (cantidad > 0) dinero.value += cantidad
  }

  function reiniciar() {
    dinero.value = DINERO_INICIAL
  }

  return { dinero, restar, sumar, reiniciar }
})