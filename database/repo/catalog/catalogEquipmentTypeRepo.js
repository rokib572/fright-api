const catalogEquipmentType = require('../../models/catalogEquipmentType')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)

const getCatalogEquipmentType = async () => {
  try {
    var response = await catalogEquipmentType.get()
    return successResponse(response)
  } catch (err) {
    logger.error('Error in get_all_catalogEquipmentType, error ->>', err)
    return errorResponse('Something went wrong in server', 500)
  }
}

const checkCatalogEquipmentTypeID = async (Id) => {
  try {
    const isID = await catalogEquipmentType.get({
      where: {
        id: Id,
      },
    })
    if (isID.length === 0) {
      return false
    }
    return true
  } catch (e) {
    logger.error('error on quotes repo checkCatalogEquipmentTypeID response--->', e.message)
    return false
  }
}


module.exports = {
  getCatalogEquipmentType,
  checkCatalogEquipmentTypeID
}
