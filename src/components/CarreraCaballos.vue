
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import type { Caballo } from '../models/Horse'
import { useApuesta } from '../composables/useApuesta'
import ApuestaForm from './ApuestaForm.vue'

const { apuesta, errorApuesta, apostar, ganar, empatar, reiniciarApuesta } = useApuesta()

const carreraEnCurso = ref(false)
const caballoElegido = ref<number | null>(null)
const ganadorCarrera = ref<Caballo | null>(null)

let temporizador: ReturnType<typeof setInterval> | undefined

const caballos = ref<Caballo[]>([
  {
    id: 1, color: 'rojo', posicionX: 0, img: 'caballoRojo.png',
    cuota: 1.8, avanceMin: 3, avanceMax: 7
  },
  {
    id: 2, color: 'azul', posicionX: 0, img: 'caballoAzul.png',
    cuota: 2.5, avanceMin: 3, avanceMax: 6
  },
  {
    id: 3, color: 'verde', posicionX: 0, img: 'caballoVerde.png',
    cuota: 4, avanceMin: 3, avanceMax: 5
  },
  {
    id: 4, color: 'amarillo', posicionX: 0, img: 'caballoAmarillo.png',
    cuota: 6, avanceMin: 3, avanceMax: 4
  }
])

function avanzar(caballo: Caballo) {
  const avance = Math.floor(
    Math.random() * (caballo.avanceMax - caballo.avanceMin + 1)
  ) + caballo.avanceMin

  caballo.posicionX += avance
}

function iniciar_carrera() {
  if (carreraEnCurso.value || caballoElegido.value === null) return

  caballos.value.forEach(caballo => {
    caballo.posicionX = 0
  })

  ganadorCarrera.value = null
  carreraEnCurso.value = true

  temporizador = setInterval(() => {
    caballos.value.forEach(caballo => {
      if (caballo.posicionX < 100) {
        avanzar(caballo)
      }
    })

    const finalistas = caballos.value.filter(
      caballo => caballo.posicionX >= 100
    )

    if (finalistas.length > 0) {
      ganadorCarrera.value = finalistas.reduce((anterior, actual) =>
        actual.posicionX > anterior.posicionX ? actual : anterior
      )

      if (temporizador !== undefined) {
        clearInterval(temporizador)
        temporizador = undefined
      }
      calcularResultado();
      carreraEnCurso.value = false
    }
  }, 500)
}

function reiniciarCarrera() {
  if (temporizador !== undefined) {
    clearInterval(temporizador)
    temporizador = undefined
  }

  caballos.value.forEach(caballo => {
    caballo.posicionX = 0
  })

  caballoElegido.value = null
  ganadorCarrera.value = null
  carreraEnCurso.value = false
  reiniciarApuesta()
}

onUnmounted(() => {
  if (temporizador !== undefined) {
    clearInterval(temporizador)
  }
})

function calcularResultado(){
    if(ganadorCarrera.value?.id === caballoElegido.value){
        ganar(ganadorCarrera.value.cuota);
    }
}
</script>

<template>
  <div class="carrera-caballos">
    <div v-if="apuesta < 1">
    <section class="seleccion-caballo">
        <h2>¿Quién ganará la carrera?</h2>

        <label v-for="caballo in caballos" :key="caballo.id">
          <input
            type="radio"
            :value="caballo.id"
            v-model="caballoElegido"
            :disabled="carreraEnCurso"
          />

          {{ caballo.color }} — Cuota: {{ caballo.cuota.toFixed(2) }}
        </label>
      </section>
      <ApuestaForm
      v-if="caballoElegido"
      :error="errorApuesta"
      @apostar="apostar"
        />
    </div>
    

    <template v-else>
      <h1 class="titulo">Carrera de Caballos</h1>

      <div class="pista">
        <div class="meta"></div>

        <div
          v-for="caballo in caballos"
          :key="caballo.id"
          class="carril"
        >
          <span class="carril__numero">{{ caballo.id }}</span>

          <div
            class="caballo"
            :style="{ '--pos': Math.min(caballo.posicionX, 100) }"
          >
            <img
              :src="`/caballos/${caballo.img}`"
              :alt="`Caballo ${caballo.color}`"
            />
          </div>
        </div>
      </div>

      <button
        class="boton"
        @click="iniciar_carrera"
        :disabled="carreraEnCurso || caballoElegido === null || !!ganadorCarrera"
      >
        {{ carreraEnCurso ? 'Carrera en curso...' : 'Iniciar carrera' }}
      </button>

      <div v-if="ganadorCarrera" class="resultado">
        <h2>¡Ha ganado el caballo {{ ganadorCarrera.color }}!</h2>

        <p v-if="ganadorCarrera.id === caballoElegido">
          ¡Has acertado! Cuota: {{ ganadorCarrera.cuota.toFixed(2) }}
        </p>

        <p v-else>
          Esta vez no has acertado. ¡Suerte en la próxima carrera!
        </p>

        <button class="boton" @click="reiniciarCarrera">
          Nueva carrera
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped src="../assets/carreraCaballos.css"></style>