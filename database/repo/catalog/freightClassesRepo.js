const catalogFreightClass = require('../../models/catalogFreightClass')
const { successResponse, errorResponse } = require(`${__base}helpers`)

const logger = require(`${__base}/utils/logger`)
//Get All FreightClasses
const getAllFreightClasses = async (columns) => {
  try {
    var response = await catalogFreightClass.get({ columns })
    return successResponse(response)
  } catch (err) {
    logger.error('Error in get_all_freight_class, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

module.exports = {
  getAllFreightClasses,
}
