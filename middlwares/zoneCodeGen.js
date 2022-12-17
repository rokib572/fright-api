const usersLocation = require('../database/models/usersLocation')

const getZoneCode = require(`${__base}utils/getZoneCode`)
module.exports = async (req, res, next) => {
  const { companyCountry, companyProvince, companyCity, companyName } = req.body
  if (!companyCountry || !companyProvince || !companyCity || !companyName) {
    next()
  } else {
    let zoneCode = getZoneCode(companyCountry, companyProvince, companyCity, companyName)
    const existingCode = await isZoneCodeExist(zoneCode)
    if (existingCode) {
      const lastCharacter = existingCode.slice(-1)
      if (!isNaN(lastCharacter)) {
        if (existingCode[existingCode.length - 1] == 9) {
          const lastTwoDigits = existingCode.slice(-2)
          if (!isNaN(lastTwoDigits)) {
            zoneCode = existingCode.slice(0, -2) + (parseInt(lastTwoDigits) + 1)
          } else zoneCode = existingCode.slice(0, -2) + (parseInt(lastCharacter) + 1)
        } else {
          zoneCode = existingCode.slice(0, -1) + (parseInt(lastCharacter) + 1)
        }
      } else {
        zoneCode = existingCode.slice(0, -1) + '1'
      }
    }
    req.body['zoneCode'] = zoneCode
    next()
  }
}

const isZoneCodeExist = async (zoneCode) => {
  zoneCode = zoneCode.slice(0, -2)
  const result = await usersLocation.get({
    columns: ['zoneCode'],
    cwhere: `zoneCode like '${zoneCode}%' order By createdAt DESC`,
  })
  if (result.length > 0) {
    return result[0].zoneCode
  }
  return false
}
