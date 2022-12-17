const { databaseOperations } = require('./index')

class quotesEquipment extends databaseOperations {
  constructor() {
    super('quotesEquipment')
  }
}

module.exports = new quotesEquipment()
