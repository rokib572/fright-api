const axios = require('axios')
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const getEnvValue = require(`${__base}/service/getEnvValue`)

async function getLatLngByAddress(location) {
  // let encLocation = encodeURIComponent(location)
  const here_api_key = await getEnvValue('HERE_API_KEY')
  let url = `https://geocode.search.hereapi.com/v1/geocode?q=${location}&apiKey=${here_api_key}`

  try {
    let response = await axios.get(url)
    response = response.data
    const result = await Object.values(JSON.parse(JSON.stringify(response)))
    if (result[0][0].position) {
      const data = {
        lat: result[0][0].position.lat,
        lng: result[0][0].position.lng,
        location: result[0][0].address.label,
      }
      return successResponse(data)
    }
    return errorResponse('Could not get location lat/lng', 500)
  } catch (err) {
    logger.error("Error in getLatLngByAddress_function, error ->>", err)
    return errorResponse('Could not get location lat/lng', 500)
  }
}

module.exports = getLatLngByAddress
