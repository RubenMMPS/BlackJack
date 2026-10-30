<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import { JUEGOS } from './data/juegos'

const juegosDisponibles = computed(() => JUEGOS.filter((j) => j.disponible))
</script>

<template>
  <AppHeader>
    <template #nav>
      <RouterLink
        v-for="juego in juegosDisponibles"
        :key="juego.id"
        :to="`/${juego.id}`"
        class="nav-link"
      >
        {{ juego.nombre }}
      </RouterLink>
    </template>
  </AppHeader>

  <main>
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
</template>