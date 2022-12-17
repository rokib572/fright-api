export const isAlpha = (str) => {
  if (!str) return true
  return /^[a-zA-Z]+$/.test(str)
}

export const isAlphaNumeric = (str) => {
  if (!str) return true
  return /^[a-zA-Z0-9]+$/.test(str)
}

export const isNumeric = (str) => {
  if (!str) return true
  return /^[0-9]+$/.test(str)
}

export const isPhoneNumber = (str) => {
  if (!str) return true
  return /^[0-9]{10}$/.test(str)
}

export const isObject = (obj) => {
  return obj && typeof obj === 'object' && !Array.isArray(obj)
}

export const isArray = (obj) => {
  return Array.isArray(obj)
}

module.exports = {
  isAlpha,
  isAlphaNumeric,
  isNumeric,
  isPhoneNumber,
  isObject,
  isArray
}