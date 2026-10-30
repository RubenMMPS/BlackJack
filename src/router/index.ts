import { createRouter, createWebHistory } from 'vue-router'
import BlackJack from '../components/BlackJack.vue'
import CarreraCaballos from '../components/CarreraCaballos.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/blackjack' },
    { path: '/blackjack', component: BlackJack },
    { path: '/CarreraCaballos', component: CarreraCaballos },
  ],
})

export default router
