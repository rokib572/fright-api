const axios = require('axios')
const logger = require(`${__base}/utils/logger`)
const { meterToMile } = require(`${__base}utils/converter`)

const getDistanceByTruck = (data) => {
  let distances = []
  data.map((item) => {
    if (item.transport.mode === 'truck') {
      distances.push(meterToMile(item.summary['length']))
    }
  })
  return distances
}

async function getMileageBetweenTwoPoint(objOrigin, objDestination) {
  let url = `${process.env.HERE_WEB_URL_PREFIX}transportMode=truck&origin=${objOrigin.lat},${objOrigin.lng}&destination=${objDestination.lat},${objDestination.lng}&return=tolls,summary,typicalDuration&apiKey=${process.env.HERE_API_KEY}`

  try {
    let response = await axios.get(url)
    response = await Object.values(JSON.parse(JSON.stringify(response.data)))
    if (response[0][0].sections.length > 0) {
      let distances = getDistanceByTruck(response[0][0].sections)
      return {
        statusCode: 200,
        status: 'success',
        result: distances,
      }
    }
    return {
      statusCode: 500,
      status: 'error',
      error: "Couldn't found any routes",
    }
  } catch (err) {
    logger.error(err)
    return {
      statusCode: 500,
      status: 'error',
      error: 'Could not get mileage',
    }
  }
}

module.exports = getMileageBetweenTwoPoint
