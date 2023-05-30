import React from 'react'
import classes from './Spinner.module.css'

function Spinner() {
  return (
    <div className={classes.ldsEllipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Spinner
