module.exports = (errorArray) => {
  let errorMessage = ''
  errorArray && errorArray.forEach((error) => {
    errorMessage += `${error.message}`
    if (errorArray.indexOf(error) !== errorArray.length - 1) {
      errorMessage += ' && '
    }
  })
  return errorMessage
}
