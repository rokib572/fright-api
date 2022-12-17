const { default: axios } = require('axios')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const getTimeZoneByLocation = async (lat, lon) => {
  try {
    const apiKey = process.env.TIME_ZONE_DB_API_KEY
    const url = `${process.env.TIME_ZONE_DB_API_GATEWAY}/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lon}`
    const headers = {
      'Content-Type': 'application/json',
    }
    const { data } = await axios.post(url, { headers: headers })

    if (data.status === 'FAILED') {
      return errorResponse(data.message)
    } else {
      let dataObj = {}
      dataObj.zoneName = data.zoneName
      dataObj.gmtOffset = data.gmtOffset
      dataObj.dst = data.dst
      return successResponse(dataObj)
    }
  } catch (err) {
    return errorResponse(err.message)
  }
}

module.exports = { getTimeZoneByLocation }
