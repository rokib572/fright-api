const catalogAccessorial = require('../../models/catalogAccessorial')

const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

//save Catalog Accessorials

const saveCatalogAccessorials = async (data) => {
    try {
        const accessorialObj = {}
        accessorialObj.accessorial = data
        let response = await catalogAccessorial.save(accessorialObj)
        if (response.affectedRows) {
            return successResponse('Catalog Accessorial insertion successfully')
        }
        return errorResponse('Catalog Accessorial insertion Failed')
    } catch (err) {
        logger.error('Error in Save Catalog Accessorials repo, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Get All Catalog Accessorials
const getCatalogAccessorials = async () => {
    try {
        let response = await catalogAccessorial.get()
        if (response.length > 0) {
            return successResponse(response)
        } else {
            return errorResponse('Catalog Accessorials Not Found')
        }
    } catch (err) {
        logger.error('Error in get_catalogAccessorials repo, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

module.exports = { getCatalogAccessorials, saveCatalogAccessorials }
