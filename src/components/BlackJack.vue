<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Carta } from '../models/Card'

const manoJugador = ref<Carta[]>([])
const manoCrupier = ref<Carta[]>([])
const baraja = ref<Carta[]>([]);

const valorJugador = computed(() => calcularValor(manoJugador.value));

const valorCrupier = computed(() => calcularValor( manoCrupier.value ));

const monstrarManoCrupier = ref(false);
const contador = ref(0);
let ganador = ref('');
let dinero = ref(1000);
let apuestaInput = ref(0);
let apuesta = ref(0);
let errorApuesta = ref('');

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
      robar(manoCrupier.value);
    }

    contador.value += 1;
}
function robar (mano: Carta[]) {
  mano.push(baraja.value.shift()!);
}

function robarCrupier () {
  while(valorCrupier.value < 17){
    robar(manoCrupier.value);
  }
}

function plantarse () {
  robarCrupier();
  monstrarManoCrupier.value = true;
  calcularGanador();
}

function calcularValor(mano: Carta[]){
  let valor = 0;
  let numAses = 0;
  for(let i = 0; i < mano.length; i++){
    if(mano[i]!.nombre == "As"){
      numAses += 1;
    }
    valor += mano[i]!.valor!
  }

  for(let i = 0; i < numAses; i++){
    if(valor + 10 <= 21){
      valor += 10;
    }
  }
  return valor;
}

function calcularGanador(){
  if(valorCrupier.value < valorJugador.value || valorCrupier.value > 21){
    ganador.value = "Jugador";
    dinero.value += apuesta.value*2;
    return;
  }else if(valorCrupier.value > valorJugador.value){
    ganador.value = "Crupier";
    return;
  }
  ganador.value = "Empate"; 
  dinero.value += apuesta.value;
}

function apostar (cantidad: number) {
  if(cantidad > dinero.value){
    errorApuesta.value = "La apuesta no puede ser superior a tu dinero actual."
    return;
  }else if(cantidad < 1){
    errorApuesta.value = "La apuesta no puede ser inferior a 1€."
    return;
  }
  apuesta.value = cantidad;
  dinero.value -= cantidad;
}

function reiniciar () {
  manoJugador.value = [];
  manoCrupier.value = [];
  baraja.value = [];
  contador.value = 0;
  monstrarManoCrupier.value = false;
  ganador.value = '';
  apuesta.value = 0;
  errorApuesta.value = '';
}
</script>

<template>
   <header style=" position: absolute; top: 0; right: 0; padding: 10px; background-color: lightgreen; border-bottom-left-radius: 10px;">
    Dinero Actual: {{ dinero }}€
   </header>
   <body style=" display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
    <h1>BlackJack</h1>
    <section v-if="apuesta < 1">
      <p v-if="errorApuesta" style="color: red;">{{ errorApuesta }}</p>
      <p>Realiza una apuesta para comenzar el juego.</p>
      <input type="number" v-model.number="apuestaInput" min="1" :max="dinero" placeholder="Cantidad a apostar">
      <button @click="apostar(apuestaInput)">Apostar</button>
    </section>
    <section v-if="apuesta >= 1">
      <p>Apostando {{ apuesta }} €</p>
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
      <button v-if="contador >= 1 && !ganador" @click="robar(manoJugador)">Robar Carta</button>
      <br>
      <p>Valor actual Jugador: {{ valorJugador }}</p>
      <p v-if="monstrarManoCrupier">Valor actual Crupier: {{ valorCrupier }}</p>
      <button v-if="contador >= 1 && !ganador" @click="plantarse">Plantarse</button>
      <div v-if="ganador">
        <p v-if="ganador == 'Jugador'">Enhorabuena has ganado!!</p>
        <p v-if="ganador == 'Crupier'">Lastimosamente has perdido...</p>
        <p v-if="ganador == 'Empate'">Has Empatado!!</p>
        <button @click="reiniciar">Reiniciar</button>
      </div>
      </div>
      <div v-else>
        <span>Mano del jugador: [ </span>
        <span v-for="carta in manoJugador" :key="carta.nombre">{{ carta.nombre }} de {{ carta.palo }}, </span>
        <span>]</span>
        <p>Has perdido, tu valor es {{ valorJugador }}</p>
        <button @click="reiniciar">Reiniciar</button>
      </div>
    </section>
   </body>
</template>