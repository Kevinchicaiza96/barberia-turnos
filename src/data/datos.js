export const servicios = [
  { id: 1, nombre: 'Corte de cabello', precio: 15000, duracion: 30 },
  { id: 2, nombre: 'Corte + barba', precio: 25000, duracion: 45 },
  { id: 3, nombre: 'Arreglo de barba', precio: 12000, duracion: 20 },
  { id: 4, nombre: 'Tintura', precio: 35000, duracion: 60 },
]

export const barberos = [
  { id: 1, nombre: 'Andrés García', horario: 'Lun–Sáb · 8am–4pm' },
  { id: 2, nombre: 'Luis Martínez', horario: 'Lun–Sáb · 8am–4pm' },
  { id: 3, nombre: 'Felipe Ruiz', horario: 'Lun–Sáb · 8am–4pm' },
]

export const turnosIniciales = []

// Genera slots de 30 min entre 8am-12pm y 1pm-4pm
export function generarSlots() {
  const slots = []
  const franjas = [
    { inicio: 8 * 60, fin: 12 * 60 },
    { inicio: 13 * 60, fin: 16 * 60 },
  ]
  for (const franja of franjas) {
    let t = franja.inicio
    while (t < franja.fin) {
      const hh = String(Math.floor(t / 60)).padStart(2, '0')
      const mm = String(t % 60).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
      t += 30
    }
  }
  return slots
}

// Dado un slot y duración, devuelve todos los slots que ocupa
export function slotsOcupados(horaInicio, duracionMin, todosSlots) {
  const idx = todosSlots.indexOf(horaInicio)
  if (idx === -1) return []
  const cantidad = Math.ceil(duracionMin / 30)
  return todosSlots.slice(idx, idx + cantidad)
}