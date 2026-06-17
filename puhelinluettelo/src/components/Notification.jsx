const Notification = ({ successMessage,errorMessage }) => {
  if (successMessage === null && errorMessage===null) {
    return null
  }
  if (successMessage!=null && errorMessage===null){
    return (
    <div className="success">
      {successMessage}
    </div>
    )
  }

  if (successMessage===null && errorMessage!=null){
  return (
    <div className="error">
    {errorMessage}
    </div>
  )
}
}

export default Notification