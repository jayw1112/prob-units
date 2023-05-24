'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react' // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
import {
  addInmate,
  deleteInmate,
  getInmates,
  updateInmate,
} from '@/public/firebase.utils'
import { db } from '@/public/firebase'

const UnitPage = ({ params }) => {
  const gridRef = useRef() // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState() // Set rowData to Array of Objects, one Object per Row

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newInmateData, setNewInmateData] = useState({
    pdjNumber: '',
    firstName: '',
    lastName: '',
  })

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'lastName',
      headerName: 'Last Name',
      colId: 'Last Name',
      sort: 'asc',
    }, // - set to sort by Last Name ascending
    { field: 'firstName', headerName: 'First Name' },
    {
      field: 'pdjNumber',
      headerName: 'PDJ #',
      type: 'numberColumn',
      maxLength: 6,
      editable: false,
    },
    { field: 'DOB', type: 'dateColumn' },
    { field: 'Age', type: 'numberColumn', sortable: false },
    {
      field: 'Ethnicity',
      width: 90,
      filter: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['A', 'B', 'H', 'W', '(Other)'] },
    },
    { field: 'Intake', type: 'dateColumn' },
    {
      field: 'Room',
      type: 'smallColumn',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
        ],
      },
    },
    { field: 'Destination', width: 175 },
    { field: 'Charge' },
    { field: 'Code', type: 'smallColumn' },
    { field: 'Comments', width: 200 },
  ])

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    editable: true,
    width: 150,
    filter: true,
  }))

  // define a column type (you can define as many as you like)
  const columnTypes = {
    nonEditableColumn: { editable: false },
    dateColumn: {
      filter: 'agDateColumnFilter',
      // filterParams: { comparator: myDateComparator },
      suppressMenu: true,
      width: 100,
    },
    numberColumn: {
      filter: 'agNumberColumnFilter',
      // filterParams: { applyButton: true, clearButton: true },
      width: 100,
    },
    smallColumn: { width: 90 },
  }

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    console.log('cellClicked', event)
  }, [])

  useEffect(() => {
    async function fetchInmates() {
      const inmates = await getInmates(db, params.unit)
      setRowData(inmates)
    }
    fetchInmates()
  }, [params.unit])

  // Example using Grid's API
  // const buttonListener = useCallback((e) => {
  //   gridRef.current.api.deselectAll()
  // }, [])

  const onCellValueChanged = async (event) => {
    const { data } = event
    const { pdjNumber } = data // assuming pdjNumber is the unique identifier
    // Update Firestore
    await updateInmate(db, params.unit, pdjNumber, data)
  }

  // This function will be called when the user clicks the "Add New Row" button
  const openDialog = () => {
    setIsDialogOpen(true)
  }

  // This function will be called when the user clicks the "OK" button in the dialog
  const handleDialogOk = async () => {
    // Validation
    if (
      !newInmateData.pdjNumber ||
      !newInmateData.firstName ||
      !newInmateData.lastName ||
      newInmateData.pdjNumber.toString().length !== 6
    ) {
      alert('Please fill in all fields and ensure PDJ Number is 6 characters.')
      return
    }

    try {
      // Add a new document to Firestore
      await addInmate(db, params.unit, newInmateData.pdjNumber, newInmateData)

      // Add the new row to rowData
      setRowData([...rowData, newInmateData])

      // Close the dialog
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error adding document: ', error)
    }
  }

  // This function will be called when the user clicks the "Cancel" button in the dialog
  const handleDialogCancel = () => {
    setIsDialogOpen(false)
  }

  // This function will be called when the user changes the input fields in the dialog
  const handleInputChange = (event) => {
    const { name, value } = event.target

    // Check if the pdjNumber is exactly 6 digits long
    if (name === 'pdjNumber' && value.toString().length > 6) {
      alert('PDJ Number must be exactly 6 digits.')
      return
    }

    // Calculate age if the DOB field is changed
    if (name === 'DOB') {
      const age = calculateAge(value)
      setNewInmateData({
        ...newInmateData,
        [name]: value,
        Age: age,
      })
    } else {
      setNewInmateData({
        ...newInmateData,
        [name]: value,
      })
    }
  }

  // Deletes selected row and deletes document from Firestore
  const deleteRow = async () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes()
    const selectedData = selectedNodes.map((node) => node.data)
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.firstName} ${node.lastName}`)
      .join(', ')
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${selectedDataStringPresentation}?`
    )
    if (isConfirmed) {
      const pdjNumbers = selectedData.map((node) => node.pdjNumber)
      await Promise.all(
        pdjNumbers.map((pdjNumber) => deleteInmate(db, params.unit, pdjNumber))
      )
      const updatedRowData = rowData.filter(
        (row) => !pdjNumbers.includes(row.pdjNumber)
      )
      setRowData(updatedRowData)
    }
  }

  // Function to calculate age based on DOB
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

  return (
    <div>
      <h1>{params.unit}</h1>
      {/* Example using Grid's API */}
      {/* <button onClick={buttonListener}>Push Me</button> */}
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className='ag-theme-alpine' style={{ width: 1600, height: 650 }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          columnTypes={columnTypes} // Column Types
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
          onCellValueChanged={onCellValueChanged}
        />
      </div>
      <button onClick={openDialog}>Add New Row</button>
      <dialog open={isDialogOpen}>
        <form method='dialog'>
          <label>
            PDJ Number:
            <input
              type='number'
              name='pdjNumber'
              value={newInmateData.pdjNumber}
              onChange={handleInputChange}
              max={999999}
            />
          </label>
          <label>
            First Name:
            <input
              type='text'
              name='firstName'
              value={newInmateData.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type='text'
              name='lastName'
              value={newInmateData.lastName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            DOB:
            <input
              type='date'
              name='DOB'
              value={newInmateData.DOB}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Intake:
            <input
              type='date'
              name='Intake'
              value={newInmateData.Intake}
              onChange={handleInputChange}
            />
          </label>
          <button type='button' onClick={handleDialogOk}>
            OK
          </button>
          <button type='button' onClick={handleDialogCancel}>
            Cancel
          </button>
        </form>
      </dialog>
      <button type='button' onClick={deleteRow}>
        Delete Row
      </button>
    </div>
  )
}

export default UnitPage
