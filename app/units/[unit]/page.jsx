'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react' // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS

const UnitPage = ({ params }) => {
  const gridRef = useRef() // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState() // Set rowData to Array of Objects, one Object per Row

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: 'Last Name', colId: 'Last Name', sort: 'asc' }, // - set to sort by Last Name ascending
    { field: 'First Name' },
    { field: 'PDJ #', type: 'numberColumn' },
    { field: 'DOB', type: 'dateColumn' },
    { field: 'Age', type: 'numberColumn' },
    { field: 'Ethnicity', width: 90, filter: false },
    { field: 'Intake', type: 'dateColumn' },
    { field: 'Room', type: 'smallColumn' },
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

  // Example load data from server
  // useEffect(() => {
  //   fetch('../../data.json')
  //     .then((result) => result.json())
  //     .then((rowData) => setRowData(rowData))
  // }, [])

  // fetch dummy data from data.json file into the rows state, using async/await

  async function getRows() {
    const response = await fetch('/data.json')
    const data = await response.json()
    setRowData(data)
  }

  useEffect(() => {
    getRows()
  }, [])

  // Example using Grid's API
  // const buttonListener = useCallback((e) => {
  //   gridRef.current.api.deselectAll()
  // }, [])

  return (
    <div>
      <h1>Unit {params.unit.toUpperCase()}</h1>

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
        />
      </div>
    </div>
  )
}

export default UnitPage
