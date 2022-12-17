const { databaseOperations } = require('./index')

class catalogEquipmentType extends databaseOperations {
  constructor() {
    super('catalogEquipmentType')
  }
}

module.exports = new catalogEquipmentType()
