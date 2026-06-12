import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB_MmjGXADXS_q1TRrDqWVZG1wv6Dh3QfU",
  authDomain: "barberia-turnos-16cf3.firebaseapp.com",
  projectId: "barberia-turnos-16cf3",
  storageBucket: "barberia-turnos-16cf3.firebasestorage.app",
  messagingSenderId: "790226542430",
  appId: "1:790226542430:web:d3d3638b0c6e6fcb88f9cf"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)