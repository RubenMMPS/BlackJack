import { createRouter, createWebHistory } from 'vue-router'
import BlackJack from '../components/BlackJack.vue'
import CarreraCaballos from '../components/CarreraCaballos.vue'
import MenuPrincipal from '../components/MenuPrincipal.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MenuPrincipal },
    { path: '/blackjack', component: BlackJack },
    { path: '/carreraCaballos', component: CarreraCaballos },
  ],
})

export default router
