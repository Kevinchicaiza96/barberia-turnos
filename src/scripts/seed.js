import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB_MmjGXADXS_q1TRrDqWVZG1wv6Dh3QfU",
  authDomain: "barberia-turnos-16cf3.firebaseapp.com",
  projectId: "barberia-turnos-16cf3",
  storageBucket: "barberia-turnos-16cf3.firebasestorage.app",
  messagingSenderId: "790226542430",
  appId: "1:790226542430:web:d3d3638b0c6e6fcb88f9cf"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const BARBERIA_ID = 'QkrmM1YbG4LxlKSa3hHa'

const servicios = [
  { nombre: 'Corte de cabello', precio: 15000, duracion: 30 },
  { nombre: 'Corte + barba', precio: 25000, duracion: 45 },
  { nombre: 'Arreglo de barba', precio: 12000, duracion: 20 },
  { nombre: 'Tintura', precio: 35000, duracion: 60 },
]

const barberos = [
  { nombre: 'Andrés García', horario: 'Lun–Sáb · 8am–4pm', estado: 'activo' },
  { nombre: 'Luis Martínez', horario: 'Lun–Sáb · 8am–4pm', estado: 'activo' },
  { nombre: 'Felipe Ruiz', horario: 'Lun–Sáb · 8am–4pm', estado: 'activo' },
]

async function seed() {
  for (const s of servicios) {
    await addDoc(collection(db, 'servicios'), { ...s, barberia_id: BARBERIA_ID })
    console.log('Servicio creado:', s.nombre)
  }
  for (const b of barberos) {
    await addDoc(collection(db, 'barberos'), { ...b, barberia_id: BARBERIA_ID })
    console.log('Barbero creado:', b.nombre)
  }
  console.log('✅ Listo')
  process.exit(0)
}

seed()