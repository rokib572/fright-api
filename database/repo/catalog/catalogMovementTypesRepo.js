const catalogMovementTypes = require('../../models/catalogMovementTypes')
const logger = require(`${__base}/utils/logger`)

const checkMovementTypeID = async (Id) => {
    try {
      const isID = await catalogMovementTypes.get({
        where: {
          id: Id,
        },
      })
      if (isID.length === 0) {
        return false
      }
      return true
    } catch (e) {
      logger.error('error on quotes repo checkMovementTypeID response--->', e.message)
      return false
    }
  }
  

module.exports = {
    checkMovementTypeID,
}
