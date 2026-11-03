import { createRouter, createWebHistory } from 'vue-router'
import BlackJack from '../components/BlackJack.vue'
import CarreraCaballos from '../components/CarreraCaballos.vue'
import MenuPrincipal from '../components/MenuPrincipal.vue'
import Tragaperras from '../components/Tragaperras.vue'
import Ruleta from '../components/Ruleta.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MenuPrincipal },
    { path: '/blackjack', component: BlackJack },
    { path: '/carreraCaballos', component: CarreraCaballos },
    { path: '/tragaperras', component: Tragaperras},
    { path: '/ruleta', component: Ruleta}
  ],
})

export default router
