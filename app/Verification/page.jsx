'use client'

import { auth, resendVerificationEmail } from '@/public/firebase'
import React, { useEffect, useState } from 'react'
import classes from './Verification.module.css'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import Link from 'next/link'

function VerificationPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        // User is verified, redirect to home page
        router.push('/')
      } else {
        setUser(auth.currentUser) // Set the user state to the current user
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [router, auth])

  const handleResendVerificationEmail = async () => {
    try {
      await resendVerificationEmail()
      alert('Verification email sent!')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Please Verify Your Email</h1>
      <p className={classes.text}>
        You must verify your email and login before you can use the app.
      </p>
      {user ? (
        <button
          className={classes.button}
          onClick={handleResendVerificationEmail}
        >
          Resend Verification Email
        </button>
      ) : (
        <Link className={classes.button} href='/Login'>
          Login
        </Link>
      )}
    </div>
  )
}

export default VerificationPage
