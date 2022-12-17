const catalogServiceTypes = require('../../models/catalogServiceType')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

//Get All Catalog Service Type
const getAllCatalogServiceType = async (columns) => {
  try {
    var response = await catalogServiceTypes.get({ columns })
    return successResponse(response)
  } catch (err) {
    logger.error('Error in get_all_catalogService, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

const getCatalogServiceTypeByLabel = async (serviceTypeLabel) => {
  try {
    let result = await catalogServiceTypes.get({
      where: {
        label: serviceTypeLabel
      }
    })

    return result?.length > 0 ? result[0] : null;
  } catch (err) {
    logger.error('Error in getCatalogServiceTypeByLabel, error ->>', err)
    return null;
  }
}

module.exports = {
  getAllCatalogServiceType,
  getCatalogServiceTypeByLabel
}
