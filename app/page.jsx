'use client'

import classes from './page.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged } from '@/public/firebase'
import { useRouter } from 'next/navigation'
import Spinner from './components/Loading/Spinner'
import isVerified from './components/Authentication/isVerified'

function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleClick = (e) => {
    e.preventDefault()
    setLoading(true)
    router.push(e.target.href)
  }

  return (
    <main className={classes.main}>
      <div className={classes.description}>
        {user && <h3>Welcome {user && user.displayName}</h3>}
        {user ? (
          loading ? (
            <Spinner /> // Display the Spinner when loading is true
          ) : (
            <>
              <h1 className={classes.title}>Units: </h1>

              <ul>
                <li>
                  <Link onClick={handleClick} href='/units/UnitA'>
                    A
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitB'>
                    B
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitC'>
                    C
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitD'>
                    D
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitE'>
                    E
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitF'>
                    F
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitG'>
                    G
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitH'>
                    H
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitJ'>
                    J
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitK'>
                    K
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitL'>
                    L
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitM'>
                    M
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitN'>
                    N
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitO'>
                    O
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitP'>
                    P
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitQ'>
                    Q
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitR'>
                    R
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitS'>
                    S
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitW1'>
                    W 1
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/UnitW2'>
                    W 2
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/BoysR'>
                    Boy's R
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/GirlsR'>
                    Girl's R
                  </Link>
                </li>
                <li>
                  <Link onClick={handleClick} href='/units/MHU'>
                    MHU
                  </Link>
                </li>
              </ul>
            </>
          )
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

export default isVerified(Home)
