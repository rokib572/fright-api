const { databaseOperations } = require('./index')

class vendorsCoverage extends databaseOperations {
  constructor() {
    super('vendorsCoverage')
  }
}

module.exports = new vendorsCoverage()
