export interface TipoFicha {
  valor: number
  nombre: string
  color: string
  borde: string
  texto: string
}

export const TIPOS_FICHA: TipoFicha[] = [
  { valor: 1000, nombre: 'Amarillo', color: '#f2c500', borde: '#ffffff', texto: '#3a2e00' },
  { valor: 100, nombre: 'Negro', color: '#1a1a1a', borde: '#ffffff', texto: '#ffffff' },
  { valor: 50, nombre: 'Azul', color: '#1d5fd1', borde: '#ffffff', texto: '#ffffff' },
  { valor: 25, nombre: 'Verde', color: '#2a9d4a', borde: '#ffffff', texto: '#ffffff' },
  { valor: 5, nombre: 'Rojo', color: '#d62828', borde: '#ffffff', texto: '#ffffff' },
  { valor: 1, nombre: 'Blanco', color: '#f4f4f4', borde: '#8a8f98', texto: '#222222' }
]

export interface GrupoFichas {
  tipo: TipoFicha
  cantidad: number
}

// Desglosa una cantidad en fichas usando el menor número posible
export function desglosarApuesta(cantidad: number): GrupoFichas[] {
  let resto = Math.floor(cantidad)
  const grupos: GrupoFichas[] = []

  for (const tipo of TIPOS_FICHA) {
    const n = Math.floor(resto / tipo.valor)
    if (n > 0) {
      grupos.push({ tipo, cantidad: n })
      resto -= n * tipo.valor
    }
  }
  return grupos
}