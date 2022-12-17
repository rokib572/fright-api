const getUtcTime = (date) => {
  if (date) {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ')
  }
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

module.exports = getUtcTime
