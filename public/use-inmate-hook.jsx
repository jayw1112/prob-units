import { useState, useEffect } from 'react'
import { db } from '@/public/firebase'
import {
  addInmate,
  deleteInmate,
  getInmates,
  updateInmate,
} from '@/public/firebase.utils'

function useInmates(unit) {
  const [inmates, setInmates] = useState([])

  useEffect(() => {
    async function fetchInmates() {
      const fetchedInmates = await getInmates(db, unit)
      setInmates(fetchedInmates)
    }
    fetchInmates()
  }, [unit])

  const addNewInmate = async (inmateData) => {
    await addInmate(db, unit, inmateData.pdjNumber, inmateData)
    setInmates([...inmates, inmateData])
  }

  const updateExistingInmate = async (pdjNumber, inmateData) => {
    await updateInmate(db, unit, pdjNumber, inmateData)
    const updatedInmates = inmates.map((inmate) =>
      inmate.pdjNumber === pdjNumber ? inmateData : inmate
    )
    setInmates(updatedInmates)
  }

  const deleteInmateByPdjNumber = async (pdjNumber) => {
    await deleteInmate(db, unit, pdjNumber)
    const remainingInmates = inmates.filter(
      (inmate) => inmate.pdjNumber !== pdjNumber
    )
    setInmates(remainingInmates)
  }

  return {
    inmates,
    addInmate: addNewInmate,
    updateInmate: updateExistingInmate,
    deleteInmate: deleteInmateByPdjNumber,
  }
}

export default useInmates
