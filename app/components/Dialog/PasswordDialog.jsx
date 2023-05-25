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
    <dialog className={classes.dialog} open={true}>
      <form method='dialog' onSubmit={handleSubmit}>
        <h3 className={classes.title2}>{title}</h3>
        <p>{description}</p>
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
        {!isPasswordValid && (
          <p className={classes.warning}>
            Password must be at least 6 characters long
          </p>
        )}
        <div className={classes.buttons}>
          <button type='submit'>{buttonLabel}</button>
          <button
            type='button'
            onClick={() => {
              closeDialog()
              setIsPasswordValid(true)
              setCurrentPassword('')
              setNewPassword('')
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  )
}