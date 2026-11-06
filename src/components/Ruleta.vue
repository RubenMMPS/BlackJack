<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useDineroStore } from '../stores/dinero'
import { TIPOS_FICHA, desglosarApuesta } from '../utils/fichas'
import FichasApuesta from './FichasApuesta.vue'

const ORDEN = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14,
  31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
]
const SLOT = 360 / ORDEN.length
const ROJOS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])

type Color = 'verde' | 'rojo' | 'negro'
const COLORES_HEX: Record<Color, string> = { verde: '#1f7a3a', rojo: '#c0281c', negro: '#151515' }

function colorDe(n: number): Color {
  if (n === 0) return 'verde'
  return ROJOS.has(n) ? 'rojo' : 'negro'
}

const FONDO_RUEDA = `conic-gradient(from ${-SLOT / 2}deg, ${ORDEN.map(
  (n, k) =>
    `${COLORES_HEX[colorDe(n)]} ${(k * SLOT).toFixed(3)}deg ${((k + 1) * SLOT).toFixed(3)}deg`
).join(', ')})`

interface Definicion {
  multiplicador: number
  gana: (n: number) => boolean
}

const DEFINICIONES: Record<string, Definicion> = {}

for (let n = 0; n <= 36; n++) {
  DEFINICIONES[`n-${n}`] = { multiplicador: 36, gana: (x) => x === n }
}
Object.assign(DEFINICIONES, {
  rojo: { multiplicador: 2, gana: (x: number) => ROJOS.has(x) },
  negro: { multiplicador: 2, gana: (x: number) => x > 0 && !ROJOS.has(x) },
  par: { multiplicador: 2, gana: (x: number) => x > 0 && x % 2 === 0 },
  impar: { multiplicador: 2, gana: (x: number) => x % 2 === 1 },
  falta: { multiplicador: 2, gana: (x: number) => x >= 1 && x <= 18 },
  pasa: { multiplicador: 2, gana: (x: number) => x >= 19 },
  doc1: { multiplicador: 3, gana: (x: number) => x >= 1 && x <= 12 },
  doc2: { multiplicador: 3, gana: (x: number) => x >= 13 && x <= 24 },
  doc3: { multiplicador: 3, gana: (x: number) => x >= 25 && x <= 36 },
  col1: { multiplicador: 3, gana: (x: number) => x > 0 && x % 3 === 1 },
  col2: { multiplicador: 3, gana: (x: number) => x > 0 && x % 3 === 2 },
  col3: { multiplicador: 3, gana: (x: number) => x > 0 && x % 3 === 0 }
})

interface Celda {
  clave: string
  etiqueta: string
  c: number
  cs: number
  f: number
  fs: number
  clase: string
}

const CELDAS: Celda[] = []

CELDAS.push({ clave: 'n-0', etiqueta: '0', c: 1, cs: 1, f: 1, fs: 3, clase: 'numero verde' })

for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 12; c++) {
    const n = c * 3 + (3 - r)
    CELDAS.push({
      clave: `n-${n}`,
      etiqueta: String(n),
      c: c + 2,
      cs: 1,
      f: r + 1,
      fs: 1,
      clase: `numero ${colorDe(n)}`
    })
  }
}
;(['col3', 'col2', 'col1'] as const).forEach((clave, r) => {
  CELDAS.push({ clave, etiqueta: '2:1', c: 14, cs: 1, f: r + 1, fs: 1, clase: 'exterior columna' })
})
;(
  [
    ['doc1', '1ª docena'],
    ['doc2', '2ª docena'],
    ['doc3', '3ª docena']
  ] as const
).forEach(([clave, etiqueta], i) => {
  CELDAS.push({ clave, etiqueta, c: 2 + i * 4, cs: 4, f: 4, fs: 1, clase: 'exterior' })
})
;(
  [
    ['falta', '1-18', ''],
    ['par', 'Par', ''],
    ['rojo', 'Rojo', 'rojo'],
    ['negro', 'Negro', 'negro'],
    ['impar', 'Impar', ''],
    ['pasa', '19-36', '']
  ] as const
).forEach(([clave, etiqueta, color], i) => {
  CELDAS.push({
    clave,
    etiqueta,
    c: 2 + i * 2,
    cs: 2,
    f: 5,
    fs: 1,
    clase: `exterior ${color}`
  })
})

const FICHAS_APUESTA = [...TIPOS_FICHA].reverse().filter((t) => t.valor <= 100)

const banca = useDineroStore()

const ruletaRef = ref<HTMLElement | null>(null)
const apuestas = ref<Record<string, number>>({})
const historial = ref<{ clave: string; valor: number }[]>([])
const apuestasAnteriores = ref<Record<string, number>>({})
const fichaActiva = ref(5)

const girando = ref(false)
const resultado = ref<number | null>(null)
const premio = ref(0)
const ultimos = ref<number[]>([])
const mensaje = ref('Elige una ficha y haz tus apuestas en el tablero.')

const ruedaGiro = ref(0)
const bolaGiro = ref(0)

const totalApostado = computed(() => Object.values(apuestas.value).reduce((a, b) => a + b, 0))
const totalAnterior = computed(() =>
  Object.values(apuestasAnteriores.value).reduce((a, b) => a + b, 0)
)

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

onBeforeUnmount(() => {
  if (totalApostado.value > 0 && !girando.value) banca.sumar(totalApostado.value)
})

function apostar(clave: string) {
  if (girando.value) return
  if (!banca.restar(fichaActiva.value)) {
    mensaje.value = 'No tienes saldo suficiente para esa ficha.'
    return
  }
  apuestas.value[clave] = (apuestas.value[clave] ?? 0) + fichaActiva.value
  historial.value.push({ clave, valor: fichaActiva.value })
  mensaje.value = 'Cuando estés listo, pulsa «Girar».'
}

function deshacer() {
  if (girando.value) return
  const ultima = historial.value.pop()
  if (!ultima) return
  const restante = (apuestas.value[ultima.clave] ?? 0) - ultima.valor
  if (restante > 0) apuestas.value[ultima.clave] = restante
  else delete apuestas.value[ultima.clave]
  banca.sumar(ultima.valor)
}

function limpiar() {
  if (girando.value || totalApostado.value < 1) return
  banca.sumar(totalApostado.value)
  apuestas.value = {}
  historial.value = []
  mensaje.value = 'Mesa limpia.'
}

function repetir() {
  if (girando.value || totalApostado.value > 0 || totalAnterior.value < 1) return
  if (!banca.restar(totalAnterior.value)) {
    mensaje.value = 'No tienes saldo suficiente para repetir.'
    return
  }
  apuestas.value = { ...apuestasAnteriores.value }
  historial.value = Object.entries(apuestasAnteriores.value).map(([clave, valor]) => ({
    clave,
    valor
  }))
  mensaje.value = 'Apuestas repetidas. Pulsa «Girar».'
}

function estiloMarca(clave: string) {
  const importe = apuestas.value[clave]
  if (!importe) return {}
  const tipo = desglosarApuesta(importe)[0]!.tipo
  return { '--color': tipo.color, '--borde': tipo.borde, '--texto': tipo.texto }
}

function etiquetaImporte(importe: number) {
  return importe >= 1000 ? `${importe / 1000}K` : String(importe)
}

async function girar() {
  if (girando.value || totalApostado.value < 1) return

  if (window.matchMedia('(max-width: 600px)').matches) {
    ruletaRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  girando.value = true
  resultado.value = null
  premio.value = 0
  mensaje.value = '¡No va más!'

  const apostado = { ...apuestas.value }
  const total = totalApostado.value
  apuestasAnteriores.value = apostado

  const numero = ORDEN[Math.floor(Math.random() * ORDEN.length)]!
  const k = ORDEN.indexOf(numero)

  const objetivo = -k * SLOT
  const resto = (((objetivo - ruedaGiro.value) % 360) + 360) % 360
  ruedaGiro.value += 5 * 360 + resto

  const m = ((bolaGiro.value % 360) + 360) % 360
  bolaGiro.value = bolaGiro.value - 7 * 360 - m

  await esperar(6200)

  let devuelto = 0
  for (const [clave, importe] of Object.entries(apostado)) {
    const def = DEFINICIONES[clave]
    if (def?.gana(numero)) devuelto += importe * def.multiplicador
  }
  if (devuelto > 0) banca.sumar(devuelto)

  resultado.value = numero
  premio.value = devuelto
  ultimos.value = [numero, ...ultimos.value].slice(0, 10)

  const nombreColor = colorDe(numero)
  if (devuelto > 0) {
    const neto = devuelto - total
    mensaje.value = `Sale el ${numero} ${nombreColor}. Cobras ${devuelto}€ (${neto >= 0 ? '+' : ''}${neto}€).`
  } else {
    mensaje.value = `Sale el ${numero} ${nombreColor}. Pierdes ${total}€.`
  }

  apuestas.value = {}
  historial.value = []
  girando.value = false
}
</script>

<template>
  <section ref="ruletaRef" class="ruleta">
    <div class="contenido">
      <div class="zona">
        <div class="rueda-zona">
          <div class="puntero" aria-hidden="true"></div>

          <div
            class="rueda-wrap"
            :class="{ girando }"
            :style="{ '--giro': ruedaGiro + 'deg', '--giro-bola': bolaGiro + 'deg', '--slot': SLOT + 'deg' }"
          >
            <div class="rueda" :style="{ background: FONDO_RUEDA }">
              <span
                v-for="(n, k) in ORDEN"
                :key="n"
                class="num"
                :style="{ transform: `rotate(${k * SLOT}deg)` }"
              >
                <b>{{ n }}</b>
              </span>
            </div>

            <div class="centro" :class="resultado === null ? '' : colorDe(resultado)">
              <span>{{ resultado ?? '♠' }}</span>
            </div>

            <div class="orbita" aria-hidden="true">
              <span class="bola-r" :class="{ cae: !girando }"></span>
            </div>
          </div>

          <ul class="ultimos" aria-label="Últimos números">
            <li v-for="(n, i) in ultimos" :key="i" :class="colorDe(n)">{{ n }}</li>
          </ul>
        </div>

        <div class="tablero">
          <div class="mesa-apuestas">
            <button
              v-for="c in CELDAS"
              :key="c.clave"
              class="celda"
              :class="c.clase"
              :style="{ '--c': c.c, '--cs': c.cs, '--f': c.f, '--fs': c.fs }"
              :disabled="girando"
              :aria-label="`Apostar a ${c.etiqueta}`"
              @click="apostar(c.clave)"
            >
              {{ c.etiqueta }}
              <span v-if="apuestas[c.clave]" class="marca" :style="estiloMarca(c.clave)">
                {{ etiquetaImporte(apuestas[c.clave]!) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <p class="mensaje" aria-live="polite">{{ mensaje }}</p>

      <div class="controles">
        <div class="fichas-selector" role="group" aria-label="Elegir ficha">
          <button
            v-for="t in FICHAS_APUESTA"
            :key="t.valor"
            class="ficha-boton"
            :class="{ activa: fichaActiva === t.valor }"
            :style="{ '--color': t.color, '--borde': t.borde, '--texto': t.texto }"
            :aria-pressed="fichaActiva === t.valor"
            :aria-label="`Ficha de ${t.valor} euros`"
            @click="fichaActiva = t.valor"
          >
            {{ t.valor }}
          </button>
        </div>

        <div class="total">
          <FichasApuesta :cantidad="totalApostado" />
          <span>Apuesta total: <strong>{{ totalApostado }}€</strong></span>
        </div>

        <div class="acciones">
          <button class="btn btn-secundario" :disabled="girando || !historial.length" @click="deshacer">
            Deshacer
          </button>
          <button class="btn btn-secundario" :disabled="girando || totalApostado < 1" @click="limpiar">
            Limpiar
          </button>
          <button
            v-if="totalAnterior > 0"
            class="btn"
            :disabled="girando || totalApostado > 0 || totalAnterior > banca.dinero"
            @click="repetir"
          >
            Repetir {{ totalAnterior }}€
          </button>
          <button class="btn btn-girar" :disabled="girando || totalApostado < 1" @click="girar">
            Girar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped src="../assets/ruleta.css"></style>