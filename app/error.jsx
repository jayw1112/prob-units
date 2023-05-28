// app/dashboard/error.js
'use client' // Error components must be Client Components

import { useEffect } from 'react'
import classes from './error.module.css'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Something went wrong!</h2>
      {error.code && <p>Error Code: {error.code}</p>}
      {error.message && <p>Error Message: {error.message}</p>}
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
