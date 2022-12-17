const catalogAirport = require('../../models/catalogAirport')
const customQuery = require('../../models/customQuery')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

//Get All Airports
const getCatalogAirports = async (columns, query) => {
    try {
        let response = await getCatalogAirportsBySearchQuery(query, columns)
        if (response.length > 0) {
            return successResponse(response)
        } else {
            return errorResponse('Catalog Airports Not Found')
        }
    } catch (err) {
        logger.error('Error in get_catalogAirports repo, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

const getCatalogAirportsBySearchQuery = async (param, columns) => {
    let { iataCode, country, name } = param
    let result
    let sql = `SELECT ${columns} FROM catalogAirports `
    if (iataCode && !country && !name) {
        sql += ` WHERE iataCode LIKE '%${iataCode.toLowerCase()}%' ORDER BY name  `
        result = await customQuery.query(sql)
    } else if (!iataCode && country && !name) {
        sql += ` WHERE country LIKE '%${country.toLowerCase()}%' ORDER BY name  `
        result = await customQuery.query(sql)
    } else if (!iataCode && !country && name) {
        sql += ` WHERE name LIKE '%${name.toLowerCase()}%' ORDER BY name  `
        //console.log(sql)
        result = await customQuery.query(sql)
    } else {
        sql += ` ORDER BY name `
        result = await customQuery.query(sql)
    }
    return result
}

module.exports = { getCatalogAirports }
