function NewInmateDialog({ isOpen, onOk, onCancel, onChange, inmateData }) {
  return (
    <dialog open={isOpen}>
      <form method='dialog'>
        <label>
          PDJ Number:
          <input
            type='number'
            name='pdjNumber'
            value={inmateData.pdjNumber}
            onChange={onChange}
            max={999999}
          />
        </label>
        <label>
          First Name:
          <input
            type='text'
            name='firstName'
            value={inmateData.firstName}
            onChange={onChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type='text'
            name='lastName'
            value={inmateData.lastName}
            onChange={onChange}
          />
        </label>
        <label>
          DOB:
          <input
            type='date'
            name='DOB'
            value={inmateData.DOB}
            onChange={onChange}
          />
        </label>
        <label>
          Intake:
          <input
            type='date'
            name='Intake'
            value={inmateData.Intake}
            onChange={onChange}
          />
        </label>
        <button type='button' onClick={onOk}>
          OK
        </button>
        <button type='button' onClick={onCancel}>
          Cancel
        </button>
      </form>
    </dialog>
  )
}

export default NewInmateDialog
