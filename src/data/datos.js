export const servicios = [
  { id: 1, nombre: 'Corte de cabello', precio: 15000, duracion: 30 },
  { id: 2, nombre: 'Corte + barba', precio: 25000, duracion: 45 },
  { id: 3, nombre: 'Arreglo de barba', precio: 12000, duracion: 20 },
  { id: 4, nombre: 'Tintura', precio: 35000, duracion: 60 },
]

export const barberos = [
  { id: 1, nombre: 'Andrés García', horario: 'Lun–Sáb · 8am–5pm' },
  { id: 2, nombre: 'Luis Martínez', horario: 'Mar–Dom · 9am–6pm' },
  { id: 3, nombre: 'Felipe Ruiz', horario: 'Lun–Vie · 10am–7pm' },
]

export const turnosIniciales = [
  { id: 1, nombre: 'Carlos Muñoz', servicio: 'Corte + barba', barbero: 'Andrés', hora: '9:00', fecha: '2026-06-12', estado: 'completado' },
  { id: 2, nombre: 'Juan Pablo R.', servicio: 'Corte de cabello', barbero: 'Luis', hora: '9:30', fecha: '2026-06-12', estado: 'completado' },
  { id: 3, nombre: 'Santiago V.', servicio: 'Arreglo de barba', barbero: 'Felipe', hora: '10:00', fecha: '2026-06-12', estado: 'completado' },
  { id: 4, nombre: 'Miguel Ospina', servicio: 'Corte + barba', barbero: 'Andrés', hora: '10:30', fecha: '2026-06-12', estado: 'en curso' },
  { id: 5, nombre: 'Daniel Herrera', servicio: 'Tintura', barbero: 'Luis', hora: '11:00', fecha: '2026-06-12', estado: 'pendiente' },
  { id: 6, nombre: 'Ricardo Cano', servicio: 'Corte de cabello', barbero: 'Felipe', hora: '11:30', fecha: '2026-06-12', estado: 'pendiente' },
]

export const horasDisponibles = [
  '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]