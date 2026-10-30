export interface Juego {
  id: string
  nombre: string
  descripcion: string
  icono: string // símbolo grande del centro de la carta
  simbolo: string // símbolo pequeño de las esquinas
  color: string // color de acento de la carta
  disponible: boolean
}

// Para añadir un juego: una línea aquí + su componente en App.vue
export const JUEGOS: Juego[] = [
  {
    id: 'blackjack',
    nombre: 'BlackJack',
    descripcion: 'Acércate a 21 sin pasarte y vence al crupier.',
    icono: '♠',
    simbolo: '♠',
    color: '#1a1a1a',
    disponible: true
  },
  {
    id: 'carreraCaballos',
    nombre: 'Carrera de caballos',
    descripcion: 'Apuesta por tu favorito y vibra hasta la meta.',
    icono: '🐎',
    simbolo: '♞',
    color: '#b72f22',
    disponible: true
  },
  {
    id: 'tragaperras',
    nombre: 'Tragaperras',
    descripcion: 'Tira de la palanca y alinea los símbolos.',
    icono: '🎰',
    simbolo: '♦',
    color: '#1d5fd1',
    disponible: false // se activa cuando lo tengas hecho
  }
]