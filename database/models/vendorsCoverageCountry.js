const { databaseOperations } = require('./index')

class vendorsCoverageCountry extends databaseOperations {
  constructor() {
    super('vendorsCoverageCountry')
  }
}

module.exports = new vendorsCoverageCountry()
