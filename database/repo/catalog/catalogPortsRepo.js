const catalogPort = require('../../models/catalogPort')
const customQuery = require('../../models/customQuery')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

let columns = ['id', 'name', 'country', 'unloc', 'lat', 'lng']

//Get All Catalog Ports
const getCatalogPorts = async (query) => {
    try {
        let response = await getCatalogPortsBySearchQuery(query, columns)
        if (response.length > 0) {
            return successResponse(response)
        } else {
            return errorResponse('Catalog Ports Not Found')
        }
    } catch (err) {
        logger.error('Error in get_CatalogPorts repo, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Get catalog ports by id
const getCatalogPortById = async (id) => {
    try {
        let response = await catalogPort.get({ columns, where: { id } })
        if (response.length > 0) {
            return successResponse(response)
        } else {
            return errorResponse('Catalog Port Not Found')
        }
    } catch (err) {
        logger.error('Error in get_CatalogPorts byId repo, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

const getCatalogPortsBySearchQuery = async (param, columns) => {
    let { unloc, country, city } = param
    let result
    let sql = `SELECT ${columns} FROM catalogPorts `
    if (unloc && !country && !city) {
        sql += ` WHERE unloc LIKE '%${unloc.toLowerCase()}%' ORDER BY name`
        result = await customQuery.query(sql)
    } else if (!unloc && country && !city) {
        sql += ` WHERE country LIKE '%${country.toLowerCase()}%' ORDER BY name`
        result = await customQuery.query(sql)
    } else if (!unloc && !country && city) {
        sql += ` WHERE name LIKE '%${city.toLowerCase()}%' ORDER BY name`
        result = await customQuery.query(sql)
    } else {
        sql += ` ORDER BY name`
        result = await customQuery.query(sql)
    }
    return result
}

module.exports = { getCatalogPorts, getCatalogPortById }
