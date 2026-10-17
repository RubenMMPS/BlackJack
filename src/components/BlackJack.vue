<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Carta } from '../models/Card'

const manoJugador = ref<Carta[]>([])
const manoCrupier = ref<Carta[]>([])
const baraja = ref<Carta[]>([]);

const valorJugador = computed(() => {
  let valor = 0;
  let numAses = 0;
  for(let i = 0; i < manoJugador.value.length; i++){
    if(manoJugador.value[i]!.nombre == "As"){
      numAses += 1;
    }
    valor += manoJugador.value[i]!.valor!
  }

  for(let i = 0; i < numAses; i++){
    if(valor + 10 <= 21){
      valor += 10;
    }
  }
  return valor;
})

const valorCrupier = computed(() => {
  let valor = 0;
  for(let i = 0; i < manoCrupier.value.length; i++){
    valor += manoCrupier.value[i]!.valor!
  }
  return valor;
})

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
  monstrarManoCrupier.value = true;
}

function reiniciar () {
  manoJugador.value = [];
  manoCrupier.value = [];
  baraja.value = [];
  contador.value = 0;
  monstrarManoCrupier.value = false;
}
</script>

<template>
  <h1>BlackJack</h1>
  <div v-if="valorJugador <= 21" class="blackjack">
    <span>Mano del jugador: [ </span>
    <span v-for="carta in manoJugador" :key="carta.nombre">{{ carta.nombre }} de {{ carta.palo }}, </span>
    <span>]</span>
    <div v-if="monstrarManoCrupier">
      <span>Mano del crupier: [ </span>
      <span v-for="carta in manoCrupier" :key="carta.nombre">{{ carta.nombre }} de {{ carta.palo }}, </span>
      <span>]</span>
    </div>
    <p v-else>Mano del crupier: 🂠 🂠</p>
    <button v-if="contador < 1" @click="repartirCartas">Repartir cartas</button>
    <button v-if="contador >= 1" @click="robar(manoJugador)">Robar Carta</button>
    <br>
    <p>Valor actual Jugador: {{ valorJugador }}</p>
    <p v-if="monstrarManoCrupier">Valor actual Crupier: {{ valorCrupier }}</p>
    <button v-if="contador >= 1" @click="plantarse">Plantarse</button>
  </div>
  <div v-else>
    <span>Mano del jugador: [ </span>
    <span v-for="carta in manoJugador" :key="carta.nombre">{{ carta.nombre }} de {{ carta.palo }}, </span>
    <span>]</span>
    <p>Has perdido, tu valor es {{ valorJugador }}</p>
    <button @click="reiniciar">Reiniciar</button>
  </div>
</template>