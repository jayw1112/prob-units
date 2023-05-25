'use client'

import { auth, db, deleteUser } from '@/public/firebase'
import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, onAuthStateChanged } from '@firebase/auth'
import { useState, useEffect } from 'react'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import classes from './layout.module.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Probation Units',
  description: 'View and edit probation units pop sheets',
}

export default function RootLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user)
      } else {
        // User is signed out
        setUser(null)
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut(auth) // sign out the user
    router.push('/Login') // redirect to the login page
  }

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (confirmation) {
      try {
        // Get the employeeNumber and lastName from the session
        const employeeNumber = sessionStorage.getItem('employeeNumber')
        const lastName = sessionStorage.getItem('lastName')

        // Delete the Firestore document for the user
        await deleteDoc(doc(db, 'Users', `${employeeNumber}-${lastName}`))

        // Delete the user's account
        await deleteUser(auth.currentUser)

        router.push('/Login') // redirect to the login page
      } catch (error) {
        console.error('Error deleting account: ', error)
      }
    }
  }

  return (
    <html lang='en'>
      <body className={inter.className}>
        <nav className={classes.navbar}>
          <Link className={classes.home} href='/'>
            {/* Home */}
            <h1 className={classes.title}>Probation Units</h1>
          </Link>

          {user ? (
            <div className={classes.dropdown}>
              <button className={classes.dropbtn}>Account</button>
              <div className={classes.dropdownContent}>
                <div onClick={handleSignOut}>Sign Out</div>
                <div onClick={handleDeleteAccount}>Delete Account</div>
              </div>
            </div>
          ) : (
            <Link href='/Login'>Login</Link>
          )}
        </nav>
        {children}
      </body>
    </html>
  )
}
