'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react' // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
import { getInmates } from '@/public/firebase.utils'
import { auth, db } from '@/public/firebase'
import * as XLSX from 'xlsx'
import NewInmateDialog from '@/app/components/Dialog/NewInmateDialog'
import useInmates from '@/public/use-inmate-hook'
import { onAuthStateChanged } from '@firebase/auth'
import { useRouter } from 'next/navigation'

const UnitPage = ({ params }) => {
  const gridRef = useRef() // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState() // Set rowData to Array of Objects, one Object per Row
  const router = useRouter()

  const { inmates, addInmate, updateInmate, deleteInmate } = useInmates(
    params.unit
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newInmateData, setNewInmateData] = useState({
    pdjNumber: '',
    firstName: '',
    lastName: '',
    DOB: '',
    Ethnicity: '',
    Intake: '',
    Room: '',
    Destination: '',
    Charge: '',
    Code: '',
    Comments: '',
  })

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: '#',
      valueGetter: 'node.rowIndex + 1',
      width: 50,
      pinned: 'left',
    },
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
      editable: false,
    },
    {
      field: 'DOB',
      type: 'dateColumn',
      valueFormatter: (params) => {
        const date = new Date(params.value)
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      },
    },
    { field: 'Age', type: 'numberColumn', sortable: false },
    {
      field: 'Ethnicity',
      width: 90,
      filter: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['A', 'B', 'H', 'W', '(Other)'] },
    },
    {
      field: 'Intake',
      type: 'dateColumn',
      valueFormatter: (params) => {
        const date = new Date(params.value)
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      },
    },
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
    { field: 'Destination', width: 165 },
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
    cellStyle: {
      borderRight: '1px solid rgba(49, 78, 167, 0.2)',
      // borderBottom: '1px solid #444',
    },
  }))

  // define a column type (you can define as many as you like)
  const columnTypes = {
    nonEditableColumn: { editable: false },
    dateColumn: {
      filter: 'agDateColumnFilter',
      // filterParams: { comparator: myDateComparator },
      suppressMenu: true,
      width: 110,
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

  // useEffect(() => {
  //   async function fetchInmates() {
  //     const inmates = await getInmates(db, params.unit)
  //     setRowData(inmates)
  //   }
  //   fetchInmates()
  // }, [params.unit])

  // Reidirect unauthorized users to login page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is signed out, redirect to login page
        router.push('/Login')
        alert('Please Log In to view this page.')
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchInmates() {
      const inmates = await getInmates(db, params.unit)
      setRowData(inmates)
      console.log(
        `${params.unit.replace('Unit', 'Unit ')} data fetched at`,
        new Date()
      )
    }

    // Fetch inmates immediately
    fetchInmates()

    // Then fetch inmates every 5 minutes
    const intervalId = setInterval(fetchInmates, 5 * 60 * 1000)

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [params.unit])

  // Example using Grid's API
  // const buttonListener = useCallback((e) => {
  //   gridRef.current.api.deselectAll()
  // }, [])

  const onCellValueChanged = async (event) => {
    const { data } = event
    const { pdjNumber } = data // assuming pdjNumber is the unique identifier
    // Update Firestore
    // await updateInmate(db, params.unit, pdjNumber, data)
    await updateInmate(pdjNumber, data)
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
      // await addInmate(db, params.unit, newInmateData.pdjNumber, newInmateData)
      await addInmate(newInmateData)

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
      await Promise.all(pdjNumbers.map((pdjNumber) => deleteInmate(pdjNumber)))
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      rowData.map((row) => ({
        'Last Name': row.lastName,
        'First Name': row.firstName,
        'PDJ #': row.pdjNumber,
        DOB: row.DOB,
        Age: row.Age,
        Ethnicity: row.Ethnicity,
        Intake: row.Intake,
        Room: row.Room,
        Destination: row.Destination,
        Charge: row.Charge,
        Code: row.Code,
        Comments: row.Comments,
      })),
      {
        header: [
          'Last Name',
          'First Name',
          'PDJ #',
          'DOB',
          'Age',
          'Ethnicity',
          'Intake',
          'Room',
          'Destination',
          'Charge',
          'Code',
          'Comments',
        ],
        skipHeader: false,
      }
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, 'spreadsheet.xlsx')
  }

  return (
    <div>
      <h1>{params.unit.replace('Unit', 'Unit ')}</h1>
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
      <NewInmateDialog
        isOpen={isDialogOpen}
        onOk={handleDialogOk}
        onCancel={handleDialogCancel}
        onChange={handleInputChange}
        inmateData={newInmateData}
      />
      <button type='button' onClick={deleteRow}>
        Delete Row
      </button>
      <button onClick={exportToExcel}>Export Spreadsheet</button>
    </div>
  )
}

export default UnitPage
