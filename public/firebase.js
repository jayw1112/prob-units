// 'use client'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { deleteUser } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

export async function signUp(
  email,
  password,
  firstName,
  lastName,
  employeeNumber
) {
  // Validate input
  if (!email || !password || !firstName || !lastName || !employeeNumber) {
    throw new Error('All fields are required')
  }

  // Validate password length
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  // Validate employee number format
  const employeeNumberRegex = /^\d{6}$/ // Example format: 123456
  if (!employeeNumberRegex.test(employeeNumber)) {
    throw new Error('Employee number must be 6 digits')
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    // Get the user object from the UserCredential object
    const user = userCredential.user

    // Send email verification
    await sendEmailVerification(user)
    alert('Please check your email to verify your account.')

    // Set the user's display name to be the first name
    await updateProfile(user, {
      displayName: firstName,
    })

    // Create a Firestore document for the new user
    await setDoc(
      doc(collection(db, 'Users'), `${employeeNumber}-${lastName}`),
      {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        employeeNumber: employeeNumber,
        accountCreated: serverTimestamp(),
      }
    )

    sessionStorage.setItem('employeeNumber', employeeNumber)
    sessionStorage.setItem('lastName', lastName)

    console.log('Account successfully created!')
    console.log(user)
    return user
    // The user has been created successfully...
  } catch (error) {
    // There was an error creating the user...
    console.log(error)
  }
}

export async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    // Get the user object from the UserCredential object
    const user = userCredential.user

    // Check if the user's email is verified
    // if (!user.emailVerified) {
    //   throw new Error('Please verify your email before logging in.')
    // }

    // Get the user's email
    const userEmail = userCredential.user.email

    // Get all users from Firestore
    const userSnapshot = await getDocs(collection(db, 'Users'))

    // Find the user with the matching email
    let userData
    userSnapshot.forEach((doc) => {
      if (doc.data().email === userEmail) {
        userData = doc.data()
      }
    })

    // Check if the user was found
    if (userData) {
      // Set the employeeNumber and lastName in the session storage
      sessionStorage.setItem('employeeNumber', userData.employeeNumber)
      sessionStorage.setItem('lastName', userData.lastName)
      console.log(
        'Employee Number:',
        userData.employeeNumber,
        'Last Name:',
        userData.lastName
      )
    } else {
      throw new Error('No user document found')
    }

    console.log('User successfully logged in!')
    console.log(userData)
    // The user has logged in successfully...
    return user
  } catch (error) {
    console.log(error)
    throw new Error('Failed to log in: ' + error.message)
    // There was an error logging in the user...
  }
}

// export async function deleteUserAccount(currentPassword) {
//   const user = auth.currentUser
//   if (user) {
//     const credential = EmailAuthProvider.credential(user.email, currentPassword)
//     try {
//       // Re-authenticate the user
//       await reauthenticateWithCredential(user, credential)

//       // Get the employeeNumber and lastName from the session
//       const employeeNumber = sessionStorage.getItem('employeeNumber')
//       const lastName = sessionStorage.getItem('lastName')

//       // Delete the Firestore document for the user
//       await deleteDoc(doc(db, 'Users', `${employeeNumber}-${lastName}`))

//       // Delete the user's account from Firebase Authentication
//       await deleteUser(user)

//       console.log('User successfully deleted!')
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

export async function resendVerificationEmail() {
  const user = auth.currentUser
  if (user) {
    try {
      await sendEmailVerification(user)
      console.log('Verification email sent!')
    } catch (error) {
      console.log(error)
      throw new Error('Failed to send verification email: ' + error.message)
    }
  } else {
    throw new Error('No user is currently logged in')
  }
}

export { db, analytics, auth }
