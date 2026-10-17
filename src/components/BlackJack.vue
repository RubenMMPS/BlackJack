<script setup lang="ts">
import { ref } from 'vue'
import type { Carta } from '../models/Card'

const manoJugador = ref<Carta[]>([])
const manoCrupier = ref<Carta[]>([])
const baraja = ref<Carta[]>([]);

const monstrarManoCrupier = ref(false)
const contador = ref(0)

function generarBaraja () {
    const palos = ['Corazon', 'Diamante', 'Trébol', 'Pica'];
    const nombres = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jota', 'Reina', 'Rey'];
    const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

    for (let i = 0; i < palos.length; i++) {
      for(let j = 0; j < nombres.length; j++){
        baraja.value.push({ nombre: nombres[j]!, valor: valores[j]!, palo: palos[i]!})
      }
    }
    baraja.value.sort(() => Math.random() - 0.5);
}


function repartirCartas () {
  generarBaraja();

    for(let i=0; i < 2; i++){
      robar(manoJugador.value);
      robar(manoCrupier.value)
    }

    contador.value += 1;
}
function robar (mano: Carta[]) {
  mano.push(baraja.value.shift()!);
}

function robarCrupier () {

}

function plantarse () {

}
</script>

<template>
  <div class="blackjack">
    <h1>BlackJack</h1>
    <span>Mano del jugador: [ </span>
    <span v-for="carta in manoJugador" :key="carta.nombre">{{ carta.nombre }} de {{ carta.palo }}, </span>
    <span>]</span>
    <p v-if="monstrarManoCrupier">Mano del crupier: {{ manoCrupier }}</p>
    <p v-else>Mano del crupier: 🂠 🂠</p>
    <button v-if="contador < 1" @click="repartirCartas">Repartir cartas</button>
    <button v-if="contador >= 1" @click="robar(manoJugador)">Robar Carta</button>
    <br>
    <button v-if="contador >= 1" @click="plantarse">Plantarse</button>
  </div>
</template>