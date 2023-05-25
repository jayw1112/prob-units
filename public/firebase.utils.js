import { sendPasswordResetEmail } from '@firebase/auth'
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { auth } from './firebase'

// Function to add a new inmate
export async function addInmate(db, unit, pdjNumber, inmateData) {
  await setDoc(doc(db, `CJH/${unit}/Minors/${pdjNumber}`), inmateData)
}

// Function to get all inmates in a unit
export async function getInmates(db, unit) {
  const inmates = []
  const querySnapshot = await getDocs(collection(db, `CJH/${unit}/Minors`))
  querySnapshot.forEach((doc) => {
    inmates.push(doc.data())
  })
  return inmates
}

// Function to delete an inmate
export async function deleteInmate(db, unit, pdjNumber) {
  await deleteDoc(doc(db, `CJH/${unit}/Minors/${pdjNumber}`))
}

// Function to update an inmate's data
export async function updateInmate(db, unit, pdjNumber, updatedData) {
  const inmateRef = doc(db, `CJH/${unit}/Minors/${pdjNumber}`)
  await updateDoc(inmateRef, updatedData)
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email)
    console.log('Password reset email sent!')
  } catch (error) {
    console.log(error)
  }
}
