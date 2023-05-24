'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged } from '@/public/firebase'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Units: </h1>
        {user ? (
          <ul>
            <li>
              <Link href='/units/UnitA'>A</Link>
            </li>
            <li>
              <Link href='/units/UnitB'>B</Link>
            </li>
            <li>
              <Link href='/units/UnitC'>C</Link>
            </li>
            <li>
              <Link href='/units/UnitD'>D</Link>
            </li>
            <li>
              <Link href='/units/UnitE'>E</Link>
            </li>
            <li>
              <Link href='/units/UnitF'>F</Link>
            </li>
            <li>
              <Link href='/units/UnitG'>G</Link>
            </li>
            <li>
              <Link href='/units/UnitH'>H</Link>
            </li>
          </ul>
        ) : (
          <h1>
            Please{' '}
            <Link style={{ display: 'inline-block' }} href='/Login'>
              Log In
            </Link>{' '}
            to view and edit unit spreadsheets.
          </h1>
        )}
      </div>
    </main>
  )
}
