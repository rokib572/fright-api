const { databaseOperations } = require('./index')

class catalogCaCities extends databaseOperations {
  constructor() {
    super('catalogCaCities')
  }
}

module.exports = new catalogCaCities()
