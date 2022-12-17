const catalogCountries = require('../../models/catalogCountries')
const customQuery = require('../../models/customQuery')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

//Get All getTimeZones
const getCountries = async (columns) => {
  try {
    let response = await catalogCountries.get({ columns })
    if (response.length > 0) {
      return successResponse(response)
    } else {
      return errorResponse('Countries Not Found')
    }
  } catch (err) {
    logger.error('Error in get_countries repo, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

//Get All getTimeZones by id
const getCountriesByAlpha = async (columns, alpha2) => {
  try {
    let response = await catalogCountries.get({ where: { alpha2 }, columns })
    if (response.length > 0) {
      return successResponse(response[0])
    } else {
      return errorResponse('Countries Not Found')
    }
  } catch (err) {
    logger.error('Error in get_countries_by alpha repo, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

//Get all cities by id and query

const getCountriesByCodeAndQuery = async (countryCode, query) => {
  try {
    switch (countryCode.toLowerCase()) {
      case 'us':
        return successResponse(await getCountryByCode(query, 'catalogUsCities'))
      case 'ca':
        return successResponse(await getCountryByCode(query, 'catalogCaCities'))
      default:
        return successResponse(
          await getCountryByCode(query, 'catalogWorldCities')
        )
    }
  } catch (err) {
    logger.error(
      'Error in get_countries_by code and cities repo, error ->>',
      err
    )
    return errorResponse('Something went wrong in server', 500)
  }
}

const getCountryByCode = async (param, db) => {
  let { city, postalCode } = param
  let result
  let sql = `SELECT * FROM ${db} `
  if (city) {
    sql += ` WHERE city LIKE '%${city.toLowerCase()}%' `
    result = await customQuery.query(sql)
  } else if (postalCode && db !== 'catalogWorldCities') {
    sql += ` WHERE postalCode LIKE '%${postalCode}%' `
    result = await customQuery.query(sql)
  } else {
    result = await customQuery.query(sql)
  }
  return result
}

module.exports = {
  getCountries,
  getCountriesByAlpha,
  getCountriesByCodeAndQuery,
}
