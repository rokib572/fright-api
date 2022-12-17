const { databaseOperations } = require('./index')

class vendorsCoverageCountries extends databaseOperations {
  constructor() {
    super('vendorsCoverageCountries')
  }
}

module.exports = new vendorsCoverageCountries()
