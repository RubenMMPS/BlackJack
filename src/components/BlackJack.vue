<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Carta } from '../models/Card'

const manoJugador = ref<Carta[]>([])
const manoCrupier = ref<Carta[]>([])
const baraja = ref<Carta[]>([])

const valorJugador = computed(() => calcularValor(manoJugador.value))
const valorCrupier = computed(() => calcularValor(manoCrupier.value))

const monstrarManoCrupier = ref(false)
const contador = ref(0)
const ganador = ref('')
const dinero = ref(1000)
const apuestaInput = ref(0)
const apuesta = ref(0)
const errorApuesta = ref('')

const valorCrupierVisible = computed(() =>
  monstrarManoCrupier.value
    ? valorCrupier.value
    : calcularValor(manoCrupier.value.slice(0, 1))
)

const jugadorSePasa = computed(() => valorJugador.value > 21)

function generarBaraja() {
  const palos = ['Corazón', 'Diamante', 'Trébol', 'Pica']
  const nombres = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jota', 'Reina', 'Rey']
  const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]

  for (let i = 0; i < palos.length; i++) {
    for (let j = 0; j < nombres.length; j++) {
      baraja.value.push({
        nombre: nombres[j]!,
        valor: valores[j]!,
        palo: palos[i]!,
        img: nombres[j] + palos[i]!.normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '.png'
      })
    }
  }
  baraja.value.sort(() => Math.random() - 0.5)
}

function repartirCartas() {
  generarBaraja()
  for (let i = 0; i < 2; i++) {
    robar(manoJugador.value)
    robar(manoCrupier.value)
  }
  contador.value += 1
}

function robar(mano: Carta[]) {
  mano.push(baraja.value.shift()!)
}

function robarCrupier() {
  while (valorCrupier.value < 17) {
    robar(manoCrupier.value)
  }
}

function plantarse() {
  robarCrupier()
  monstrarManoCrupier.value = true
  calcularGanador()
}

function calcularValor(mano: Carta[]) {
  let valor = 0
  let numAses = 0
  for (let i = 0; i < mano.length; i++) {
    if (mano[i]!.nombre == 'As') numAses += 1
    valor += mano[i]!.valor!
  }
  for (let i = 0; i < numAses; i++) {
    if (valor + 10 <= 21) valor += 10
  }
  return valor
}

function calcularGanador() {
  if (valorCrupier.value < valorJugador.value || valorCrupier.value > 21) {
    ganador.value = 'Jugador'
    dinero.value += apuesta.value * 2
    return
  } else if (valorCrupier.value > valorJugador.value) {
    ganador.value = 'Crupier'
    return
  }
  ganador.value = 'Empate'
  dinero.value += apuesta.value
}

function apostar(cantidad: number) {
  if (cantidad > dinero.value) {
    errorApuesta.value = 'La apuesta no puede ser superior a tu dinero actual.'
    return
  } else if (!cantidad || cantidad < 1) {
    errorApuesta.value = 'La apuesta no puede ser inferior a 1€.'
    return
  }
  errorApuesta.value = ''
  apuesta.value = cantidad
  dinero.value -= cantidad
}

function reiniciar() {
  manoJugador.value = []
  manoCrupier.value = []
  baraja.value = []
  contador.value = 0
  monstrarManoCrupier.value = false
  ganador.value = ''
  apuesta.value = 0
  apuestaInput.value = 0
  errorApuesta.value = ''
}
</script>

<template>
  <div class="mesa">
    <header class="dinero">Dinero actual: {{ dinero }}€</header>

    <section class="zona-crupier">
      <div v-if="manoCrupier.length" class="mano">
        <span class="valor">{{ valorCrupierVisible }}</span>
        <div class="cartas">
          <template v-for="(carta, i) in manoCrupier" :key="carta.img">
            <img
              class="carta"
              :src="monstrarManoCrupier || i === 0 ? `/cartas/${carta.img}` : '/cartas/DetrasCartaRojo.png'"
              :alt="monstrarManoCrupier || i === 0 ? `${carta.nombre} de ${carta.palo}` : 'Carta oculta'"
            />
          </template>
        </div>
      </div>
    </section>

    <div class="tapete-texto">
      <h1>BlackJack</h1>
    </div>

    <div class="mensaje">
      <p v-if="jugadorSePasa">Te has pasado con {{ valorJugador }}. Has perdido...</p>
      <p v-else-if="ganador == 'Jugador'">¡Enhorabuena, has ganado!</p>
      <p v-else-if="ganador == 'Crupier'">Lastimosamente has perdido...</p>
      <p v-else-if="ganador == 'Empate'">¡Has empatado!</p>
    </div>

    <section class="zona-jugador">
      <div v-if="apuesta < 1" class="apuesta-form">
        <p v-if="errorApuesta" class="error">{{ errorApuesta }}</p>
        <p>Realiza una apuesta para comenzar el juego.</p>
        <div class="fila">
          <input
            type="number"
            v-model.number="apuestaInput"
            min="1"
            :max="dinero"
            placeholder="Cantidad a apostar"
            @keyup.enter="apostar(apuestaInput)"
          />
          <button class="btn" @click="apostar(apuestaInput)">Apostar</button>
        </div>
      </div>

      <template v-else>
        <div v-if="manoJugador.length" class="mano">
          <span class="valor">{{ valorJugador }}</span>
          <div class="cartas">
            <img
              v-for="carta in manoJugador"
              :key="carta.img"
              class="carta"
              :src="`/cartas/${carta.img}`"
              :alt="`${carta.nombre} de ${carta.palo}`"
            />
          </div>
        </div>

        <div class="acciones">
          <button v-if="contador < 1" class="btn" @click="repartirCartas">Repartir cartas</button>

          <template v-if="contador >= 1 && !ganador && !jugadorSePasa">
            <button class="btn" @click="robar(manoJugador)">Robar carta</button>
            <button class="btn btn-secundario" @click="plantarse">Plantarse</button>
          </template>

          <button v-if="ganador || jugadorSePasa" class="btn" @click="reiniciar">Reiniciar</button>
        </div>

        <div class="ficha-apuesta">
          <div class="ficha">{{ apuesta }}</div>
          <span>{{ apuesta }}€</span>
        </div>
      </template>
    </section>
  </div>
</template>
<style scoped src="../assets/blackjack.css"></style>