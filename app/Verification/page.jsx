'use client'

import { auth, resendVerificationEmail } from '@/public/firebase'
import React, { useEffect } from 'react'
import classes from './Verification.module.css'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from '@firebase/auth'

function VerificationPage() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        // User is verified, redirect to home page
        router.push('/')
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

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
        You must verify your email before you can use the app.
      </p>
      <button
        className={classes.button}
        onClick={handleResendVerificationEmail}
      >
        Resend Verification Email
      </button>
    </div>
  )
}

export default VerificationPage
