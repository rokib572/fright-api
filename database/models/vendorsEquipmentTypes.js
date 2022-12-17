const { databaseOperations } = require('./index')

class vendorsEquipmentTypes extends databaseOperations {
  constructor() {
    super('vendorsEquipmentTypes')
  }
}

module.exports = new vendorsEquipmentTypes()
