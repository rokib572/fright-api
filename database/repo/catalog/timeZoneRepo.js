const catalogTimeZone = require('../../models/catalogTimeZone')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

//Get All getTimeZones
const getTimeZones = async (columns) => {
  try {
    let response = await catalogTimeZone.get({ columns })
    if (response.length > 0) {
      return successResponse(response)
    } else {
      return errorResponse('TimeZone Not Found')
    }
  } catch (err) {
    logger.error('Error in get_all_timezone, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

//Get All getTimeZones by id
const getTimeZonesById = async (columns, id) => {
  try {
    let response = await catalogTimeZone.get({ where: { id }, columns })
    if (response.length > 0) {
      return successResponse(response[0])
    } else {
      return errorResponse('TimeZone Not Found')
    }
  } catch (err) {
    logger.error('Error in get_timezone by id repo, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

// get catalogTimeZone by offset and offset_dst
const getTimeZoneIdByZoneCode = async (timeZoneDetails) => {
  try {
    const {zoneName, gmtOffset, dst} = timeZoneDetails

    if(!zoneName || !gmtOffset || !dst) {
      throw new Error('Missing required fields')
    }

    let response = await catalogTimeZone.get({ where: { timezone:zoneName  } })
    
    if (response.length > 0) {
      return response[0].id
    } else {
      const dataObj = {
        timezone: zoneName,
        offset: gmtOffset,
        offset_dst: dst
      }
      await catalogTimeZone.save(dataObj)
      const result = await catalogTimeZone.get({ where: { zoneName } })
      return result[0].id
    }
  } catch (err) {
    logger.error('Error in get_timezone by offset repo, error ->>', err)
    throw new Error('Something went wrong in getTimeZoneIdByZoneCode function', 500)
  }
}

module.exports = {
  getTimeZones,
  getTimeZonesById,
  getTimeZoneIdByZoneCode
}
