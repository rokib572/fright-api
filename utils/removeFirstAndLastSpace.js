const removeFirstAndLastSpace = (str) => {
  if (typeof str === 'string') {
    return str.replace(/^\s+|\s+$/g, '')
  } else {
    return str
  }
}

module.exports = removeFirstAndLastSpace
