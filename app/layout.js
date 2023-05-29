'use client'

import { auth, db } from '@/public/firebase'
import './globals.css'
// import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from '@firebase/auth'
import { useState, useEffect } from 'react'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import classes from './layout.module.css'
import { PasswordDialog } from './components/Dialog/PasswordDialog'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Probation Units',
//   description: 'View and edit probation units pop sheets',
// }

export default function RootLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [dialogType, setDialogType] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [openOverlay, setOpenOverlay] = useState(false)

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

  const openDialog = (type) => {
    setDialogType(type)
    setIsPasswordDialogOpen(true)
    setOpenOverlay(true)
  }

  const closeDialog = () => {
    setIsPasswordDialogOpen(false)
    setOpenOverlay(false)
    setErrorMessage('')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDialog()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const openPasswordDialog = () => {
    openDialog('changePassword')
  }

  const handleDeleteAccount = async (currentPassword) => {
    const user = auth.currentUser

    if (!currentPassword || currentPassword === '') {
      setIsPasswordValid(false)
      return
    }
    setIsPasswordValid(true)

    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      try {
        // Re-authenticate the user
        await reauthenticateWithCredential(user, credential)

        // Get the employeeNumber and lastName from the session
        const employeeNumber = sessionStorage.getItem('employeeNumber')
        const lastName = sessionStorage.getItem('lastName')

        // Delete the Firestore document for the user and the user's account
        await Promise.all([
          deleteUser(user),
          deleteDoc(doc(db, 'Users', `${employeeNumber}-${lastName}`)),
        ])

        alert('Account deleted successfully')

        setCurrentPassword('') // reset the password input field
        setIsPasswordDialogOpen(false) // close the dialog box
        router.push('/Login') // redirect to the login page
      } catch (error) {
        console.error('Error deleting account: ', error)
        if (error.code === 'auth/requires-recent-login') {
          alert('Please re-login and try again.')
          handleSignOut()
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect current password.')
        } else if (error.code === 'auth/too-many-requests') {
          setErrorMessage(
            'Too many failed attempts, please try again later or reset password.'
          )
        } else {
          setErrorMessage('Something went wrong, please try again.')
        }
      }
    } else {
      console.error('No user is currently signed in')
    }
  }

  const handlePasswordChange = async (currentPassword, password) => {
    // console.log('currentPassword: ', currentPassword)
    const user = auth.currentUser
    // console.log('user: ', user)
    // console.log('password: ', password)
    if (password.length < 6) {
      setIsPasswordValid(false)
      return
    }
    setIsPasswordValid(true)
    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )
      try {
        await reauthenticateWithCredential(user, credential)
        await updatePassword(user, password)
        alert('Password changed successfully')
        setIsPasswordDialogOpen(false)
        setPassword('')
        setCurrentPassword('')
      } catch (error) {
        console.error('Error changing password: ', error)
        if (error.code === 'auth/requires-recent-login') {
          alert('Please re-login and try again.')
          handleSignOut()
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect current password.')
        } else if (error.code === 'auth/too-many-requests') {
          setErrorMessage('Too many failed attempts, please try again later.')
        } else {
          setErrorMessage('Something went wrong, please try again.')
        }
      }
    } else {
      console.error('No user is currently signed in')
    }
  }

  // const openPasswordDialog = () => {
  //   setIsPasswordDialogOpen(true)
  // }

  return (
    <html lang='en'>
      <body>
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
                <div onClick={openPasswordDialog}>Change Password</div>
                <div onClick={() => openDialog('deleteAccount')}>
                  Delete Account
                </div>
              </div>
            </div>
          ) : (
            <Link href='/Login'>Login</Link>
          )}
          {isPasswordDialogOpen && dialogType === 'changePassword' && (
            <PasswordDialog
              title='Change Password'
              description='Enter your current password and your new password.'
              buttonLabel='Change Password'
              onSubmit={handlePasswordChange}
              showNewPasswordField={true}
              closeDialog={closeDialog}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              openOverlay={openOverlay}
            />
          )}
          {isPasswordDialogOpen && dialogType === 'deleteAccount' && (
            <PasswordDialog
              title='Delete Account'
              description='Enter your current password to delete your account.'
              buttonLabel='Delete Account'
              onSubmit={handleDeleteAccount}
              showNewPasswordField={false}
              closeDialog={closeDialog}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              openOverlay={openOverlay}
            />
          )}
        </nav>
        {children}
      </body>
    </html>
  )
}
