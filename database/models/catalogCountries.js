const { databaseOperations } = require('./index')

class catalogCountries extends databaseOperations {
  constructor() {
    super('catalogCountries')
  }
}

module.exports = new catalogCountries()
