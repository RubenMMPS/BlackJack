import { ref, computed } from 'vue'
import { useDineroStore } from '../stores/dinero'

export function useApuesta() {
  const banca = useDineroStore()
  const apuesta = ref(0)
  const errorApuesta = ref('')

  const hayApuesta = computed(() => apuesta.value > 0)

  function apostar(cantidad: number): boolean {
    if ( cantidad < 1) {
      errorApuesta.value = 'La apuesta debe ser de al menos 1€.'
      return false
    }
    if (cantidad > banca.dinero) {
      errorApuesta.value = 'La apuesta no puede ser superior a tu dinero actual.'
      return false
    }
    errorApuesta.value = ''
    apuesta.value = cantidad
    banca.restar(cantidad)
    return true
  }

  function ganar(multiplicador = 2) {
    banca.sumar(apuesta.value * multiplicador)
  }

  function empatar() {
    banca.sumar(apuesta.value)
  }

  function reiniciarApuesta() {
    apuesta.value = 0
    errorApuesta.value = ''
  }

  return { apuesta, errorApuesta, hayApuesta, apostar, ganar, empatar, reiniciarApuesta }
}