'use client'

import { auth, logIn, signUp } from '@/public/firebase'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import classes from './AuthForm.module.css'
import { resetPassword } from '@/public/firebase.utils'
import { sendEmailVerification } from '@firebase/auth'

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false) // state to toggle between sign up and log in
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  // const handleSubmit = async (event) => {
  //   event.preventDefault()

  //   // Reset the error message
  //   setError('')

  //   // Validate the input fields
  //   if (
  //     !email ||
  //     !password ||
  //     (isSignUp && (!firstName || !lastName || !employeeNumber))
  //   ) {
  //     setError('All fields are required.')
  //     return
  //   }

  // -----********------ Check if the email ends with @probation.lacounty.gov -----********------
  // if (!email.endsWith('@probation.lacounty.gov')) {
  //   setError('Please use an email that ends with @probation.lacounty.gov')
  //   return
  // }

  //   try {
  //     if (isSignUp) {
  //       await signUp(email, password, firstName, lastName, employeeNumber)
  //     } else {
  //       await logIn(email, password)
  //     }
  //     router.push('/')
  //   } catch (error) {
  //     setError(error.message)
  //   }
  // }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Reset the error message
    setError('')

    // Validate the input fields
    if (
      !email ||
      !password ||
      (isSignUp && (!firstName || !lastName || !employeeNumber))
    ) {
      setError('All fields are required.')
      return
    }

    // -----********------ Check if the email ends with @probation.lacounty.gov -----********------
    // if (!email.endsWith('@probation.lacounty.gov')) {
    //   setError('Please use an email that ends with @probation.lacounty.gov')
    //   return
    // }

    try {
      let user
      if (isSignUp) {
        user = await signUp(
          email,
          password,
          firstName,
          lastName,
          employeeNumber
        )
      } else {
        user = await logIn(email, password)
      }

      await user.reload()

      // Check if the user's email is verified
      if (user.emailVerified) {
        router.push('/')
      } else {
        router.push('/Verification')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    try {
      await resetPassword(email)
      const dialog = document.getElementById('emailSentDialog')
      dialog.showModal()
    } catch (error) {
      setError(error.message)
    }
  }

  // const handleResendVerificationEmail = async () => {
  //   if (!auth.currentUser) {
  //     setError('Please sign up or log in first.')
  //     return
  //   }
  //   try {
  //     await sendEmailVerification(auth.currentUser)
  //     alert('Verification email sent!')
  //   } catch (error) {
  //     setError(error.message)
  //   }
  // }

  return (
    <div className={classes.formContainer}>
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      {error && <p className={classes.warning}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='user@probation.lacounty.gov'
          title='Please enter a valid LA County Probation email address. (Ex. @probation.lacounty.gov)'
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <>
            <label htmlFor='employee number'>Employee #</label>
            <input
              type='number'
              name='employee number'
              id='employee number'
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />
            <label htmlFor='first name'>First Name</label>
            <input
              type='text'
              name='first name'
              id='first name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor='last name'>Last Name</label>
            <input
              type='text'
              name='last name'
              id='last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}
        <button type='submit'>{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Log In' : 'Create an account'}
      </button>
      {!isSignUp && (
        <button onClick={handleResetPassword}>Forgot Password?</button>
      )}
      {/* <button onClick={handleResendVerificationEmail}>
        Resend Verification Email
      </button>
 */}
      <dialog id='emailSentDialog'>
        <p>Password reset email sent!</p>
        <button
          onClick={() => document.getElementById('emailSentDialog').close()}
        >
          OK
        </button>
      </dialog>
    </div>
  )
}

export default AuthForm
