'use client'

import React, { useState, useEffect } from 'react'

const AgeCalculator = ({ onClose, selectedRow, updateAge }) => {
  const [dob, setDob] = useState('')
  const [age, setAge] = useState('')

  useEffect(() => {
    if (selectedRow) {
      setDob(selectedRow.DOB)
      setAge(selectedRow.Age)
    }
  }, [selectedRow])

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const month = today.getMonth() - birthDate.getMonth()
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleCalculateClick = () => {
    if (!selectedRow) {
      alert('Please select a row first.')
      return
    }

    const calculatedAge = calculateAge(dob)
    setAge(calculatedAge)
    updateAge(selectedRow.pdjNumber, calculatedAge)
  }

  return (
    <div>
      <button
        onClick={handleCalculateClick}
        title='Select a row and press to automatically calculate age.'
      >
        Calculate Age
      </button>
    </div>
  )
}

export default AgeCalculator
