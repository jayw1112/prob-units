import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from '@/public/firebase'
import Spinner from '../Loading/Spinner'

function isVerified(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setLoading(false) // Set loading to false when the check is done
        if (!user || !user.emailVerified) {
          // User is not verified, redirect to Verification page
          router.push('/Verification')
        }
      })

      // Cleanup subscription on unmount
      return () => unsubscribe()
    }, [router])

    // Show the spinner while loading
    if (loading) {
      return <Spinner />
    }

    return <Component {...props} />
  }
}

export default isVerified
