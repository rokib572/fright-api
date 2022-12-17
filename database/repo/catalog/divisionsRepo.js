const catalogDivision = require('../../models/catalogDivision')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

//Get All FreightClasses
const getAllDivisions = async (columns) => {
  try {
    var response = await catalogDivision.get({ columns })
    return successResponse(response)
  } catch (err) {
    logger.error('Error in get_all_divisions, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

module.exports = {
  getAllDivisions,
}
