/**
 * generate a success object
 * @param {string} data Data you wants
 * @param {int} code Status code
 * @param {string} status Status
 * @returns {object} Success object
 */
const successResponse = (data, code = 200, status = 'success') => {
  if (code == 200) status = 'success'
  if (code == 201) status = 'created'
  if (code == 202) status = 'accepted'
  if (code == 204) status = 'no content'
  return {
    statusCode: code,
    status,
    result: data,
  }
}

/**
 * generate a error object
 * @param {string} errorMessage Error message
 * @param {int} code Status code
 * @param {string} status Status
 * @returns {object} Error object
 */
const errorResponse = (
  errorMessage = 'Something went wrong',
  code = 400,
  status = 'error'
) => {
  if (code === 400) status = 'bad request'
  if (code === 401) status = 'unauthorized'
  if (code === 403) status = 'forbidden'
  if (code === 404) status = 'not found'
  if (code === 500) status = 'error'
  if (code === 501) status = 'not implemented'
  if (code === 502) status = 'bad gateway'
  if (code === 503) status = 'service unavailable'
  if (code === 504) status = 'gateway timeout'
  if (code === 505) status = 'http version not supported'
  // if (errorMessage.constructor === Object) {
  //   errorMessage = errorMessage.message
  //     ? errorMessage.message
  //     : errorMessage.error
  //     ? errorMessage.error
  //     : errorMessage.msg
  //     ? errorMessage.msg
  //     : errorMessage
  // }
  return {
    statusCode: code,
    status,
    error: errorMessage,
  }
}

const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const validateFields = (object, fields) => {
  const errors = []
  fields.forEach((f) => {
    if (!(object && object[f])) {
      errors.push(f)
    }
  })
  return errors.length ? `${errors.join(', ')} are required fields.` : ''
}

const uniqueId = (length = 13) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const removeFirstAndLastSpace = (str) => {
  if (typeof str === 'string') {
    return str.replace(/^\s+|\s+$/g, '')
  } else {
    return str
  }
}

const kgToLbs = (value) => {
  return Number(value) * 2.2046
}

module.exports = {
  successResponse,
  errorResponse,
  validateEmail,
  validateFields,
  uniqueId,
  removeFirstAndLastSpace,
  kgToLbs,
}
