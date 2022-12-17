const catalogAirline = require('../../models/catalogAirline')
const customQuery = require('../../models/customQuery')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

let columns = ['id', 'name', 'country', 'iataCode', 'icaoCode', 'awbPrefix']

//Get All Airlines
const getCatalogAirlines = async (query) => {
  try {
    let response = await getCatalogAirlinesBySearchQuery(query, columns)
    if (response.length > 0) {
      return successResponse(response)
    } else {
      return errorResponse('Catalog Airlines Not Found')
    }
  } catch (err) {
    logger.error('Error in get_catalogAirlines repo, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

const getCatalogAirlineById = async (id) => {
  try {
    let response = await catalogAirline.get({ columns, where: { id } })
    if (response.length > 0) {
      return successResponse(response)
    } else {
      return errorResponse('Catalog Airline Not Found')
    }
  } catch (err) {
    logger.error('Error in get_catalogAirline by id repo, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

const getCatalogAirlinesBySearchQuery = async (param, columns) => {
  let { iataCode, country, name } = param
  let result
  let sql = `SELECT ${columns} FROM catalogAirlines `
  if (iataCode && !country && !name) {
    sql += ` WHERE iataCode LIKE '%${iataCode.toLowerCase()}%' `
    result = await customQuery.query(sql)
  } else if (!iataCode && country && !name) {
    sql += ` WHERE country LIKE '%${country.toLowerCase()}%' `
    result = await customQuery.query(sql)
  } else if (!iataCode && !country && name) {
    sql += ` WHERE name LIKE '%${name.toLowerCase()}%' `
    result = await customQuery.query(sql)
  } else {
    result = await customQuery.query(sql)
  }
  return result
}

module.exports = { getCatalogAirlines, getCatalogAirlineById }
