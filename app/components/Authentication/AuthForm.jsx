'use client'

import { logIn, signUp } from '@/public/firebase'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import classes from './AuthForm.module.css'

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false) // state to toggle between sign up and log in
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [employeeNumber, setEmployeeNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

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

    try {
      if (isSignUp) {
        await signUp(email, password, firstName, lastName, employeeNumber)
      } else {
        await logIn(email, password)
      }
      router.push('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className={classes.formContainer}>
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
    </div>
  )
}

export default AuthForm
