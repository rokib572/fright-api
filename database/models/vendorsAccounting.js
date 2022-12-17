const { databaseOperations } = require('./index')

class vendorsAccounting extends databaseOperations {
  constructor() {
    super('vendorsAccounting')
  }
}

module.exports = new vendorsAccounting()
