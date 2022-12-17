const customQuery = require('../../models/customQuery')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

//Get All Catalog Service Level
const getAllCatalogServiceLevel = async (columns) => {
    try {
        let sql = `SELECT ${columns} FROM catalogServiceLevels ORDER BY id ASC`
        var response = await customQuery.query(sql)
        return successResponse(response)
    } catch (err) {
        logger.error('Error in get_all_catalogServiceLevel, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

module.exports = {
    getAllCatalogServiceLevel,
}
