'use client'

import { useState } from 'react'
import classes from './PasswordDialog.module.css'

export function PasswordDialog({
  title,
  description,
  buttonLabel,
  onSubmit,
  showNewPasswordField,
  closeDialog,
  errorMessage,
  setErrorMessage,
  openOverlay,
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (showNewPasswordField && newPassword.length < 6) {
      setIsPasswordValid(false)
      return
    }
    if (!currentPassword.length) {
      setIsPasswordValid(false)
      return
    }
    setIsPasswordValid(true)
    if (title === 'Delete Account') {
      const confirmation = window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
      if (confirmation) {
        onSubmit(currentPassword)
      }
    } else {
      onSubmit(currentPassword, newPassword)
    }
  }

  return (
    <>
      {openOverlay && <div className={classes.dialogBackground}></div>}
      <dialog className={classes.dialog} open={true}>
        <form method='dialog' onSubmit={handleSubmit}>
          <h3 className={classes.title2}>{title}</h3>
          <p className={classes.description}>{description}</p>
          <div className={classes.labelContainer}>
            <label>
              Current Password:
              <input
                type='password'
                name='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
            {showNewPasswordField && (
              <label>
                New Password:
                <input
                  type='password'
                  name='newPassword'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
            )}
          </div>
          {!isPasswordValid && title !== 'Delete Account' ? (
            <p className={classes.warning}>
              Password must be at least 6 characters long
            </p>
          ) : (
            !isPasswordValid && (
              <p className={classes.warning}>
                Incorrect password, please try again.
              </p>
            )
          )}
          {/* <p className={classes.warning} id='error-message'></p> */}
          {errorMessage && <p className={classes.warning}>{errorMessage}</p>}
          <div className={classes.buttons}>
            <button type='submit'>{buttonLabel}</button>
            <button
              type='button'
              onClick={() => {
                closeDialog()
                setIsPasswordValid(true)
                setCurrentPassword('')
                setNewPassword('')
                setErrorMessage('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}
