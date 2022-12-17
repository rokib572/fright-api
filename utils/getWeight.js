const { kgToLbs, lbsToKg } = require('./converter')

const getWeight = (piece, convertedTo) => {
  if (!piece.weightType || !convertedTo) return piece.totalWeight
  const unit = piece.weightType.toLowerCase()
  convertedTo = convertedTo.toLowerCase()
  if (convertedTo === 'lbs' || convertedTo == 'lb') {
    if (unit == 'kg') {
      return Math.ceil(kgToLbs(piece.totalWeight))
    }
    return piece.totalWeight
  } else if (convertedTo === 'kg') {
    if (unit == 'lbs' || unit == 'lb') {
      return Math.ceil(lbsToKg(piece.totalWeight))
    }
    return piece.totalWeight
  }
  return piece.totalWeight
}

module.exports = getWeight
