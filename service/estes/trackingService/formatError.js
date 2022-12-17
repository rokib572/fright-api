module.exports = (errObj) => {
  let errorMessage = 'Could not get response from Estes tracking'
  if(errObj.message ) errorMessage = errObj.message
  if(errObj.error && errObj.error.message) {
    errorMessage = errObj.error.message
    if(errObj.error.details) {
      errorMessage += ` & ${errObj.error.details}`
    }
  }
  return errorMessage
}
