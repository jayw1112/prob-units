'use client'

import classes from './page.module.css'
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
    <main className={classes.main}>
      <div className={classes.description}>
        <h1 className={classes.title}>Units: </h1>
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
            <li>
              <Link href='/units/UnitJ'>J</Link>
            </li>
            <li>
              <Link href='/units/UnitK'>K</Link>
            </li>
            <li>
              <Link href='/units/UnitL'>L</Link>
            </li>
            <li>
              <Link href='/units/UnitM'>M</Link>
            </li>
            <li>
              <Link href='/units/UnitN'>N</Link>
            </li>
            <li>
              <Link href='/units/UnitO'>O</Link>
            </li>
            <li>
              <Link href='/units/UnitP'>P</Link>
            </li>
            <li>
              <Link href='/units/UnitQ'>Q</Link>
            </li>
            <li>
              <Link href='/units/UnitR'>R</Link>
            </li>
            <li>
              <Link href='/units/UnitS'>S</Link>
            </li>
            <li>
              <Link href='/units/UnitW1'>W 1</Link>
            </li>
            <li>
              <Link href='/units/UnitW2'>W 2</Link>
            </li>
            <li>
              <Link href='/units/BoysR'>Boy's R</Link>
            </li>
            <li>
              <Link href='/units/GirlsR'>Girl's R</Link>
            </li>
            <li>
              <Link href='/units/MHU'>MHU</Link>
            </li>
          </ul>
        ) : (
          <h1 className={classes.title}>
            Please{' '}
            <Link style={{ display: 'inline-block' }} href='/Login'>
              Login
            </Link>{' '}
            to view and edit unit spreadsheets.
          </h1>
        )}
      </div>
    </main>
  )
}
