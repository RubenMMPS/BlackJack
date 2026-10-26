<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Caballo } from '../models/Horse'
import FichasApuesta from './FichasApuesta.vue'
import { useApuesta } from '../composables/useApuesta'
import ApuestaForm from './ApuestaForm.vue'

const { apuesta, errorApuesta, apostar, ganar, empatar, reiniciarApuesta } = useApuesta()

const caballos = ref<Caballo[]>([
  { id: 1, color: 'rojo', posicionX: 0, img:'caballoRojo.png' },
  { id: 2, color: 'azul', posicionX: 0, img:'caballoAzul.png' },
  { id: 3, color: 'verde', posicionX: 0, img:'caballoVerde.png' },
  { id: 4, color: 'amarillo', posicionX: 0, img:'caballoAmarillo.png' }
])

function iniciar_carrera(){
    while(caballos.value.some(caballo => caballo.posicionX < 100)) {
        caballos.value.forEach(caballo => {
            avanzar(caballo);
        });
    }
}

function avanzar(caballo: Caballo){
    const avance = Math.floor(Math.random() * 5) + 1;
    caballo.posicionX += avance;
}

</script>
<template>
    <div class="carrera-caballos">
        <ApuestaForm v-if="apuesta < 1" :error="errorApuesta" @apostar="apostar" />
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
                    <img :src="`/caballos/${caballo.img}`" :alt="`Caballo ${caballo.color}`" />
                </div>
            </div>
        </div>

        <button class="boton" @click="iniciar_carrera">Iniciar Carrera</button>
        </template>
    </div>
</template>

<style scoped src="../assets/carreraCaballos.css"></style>