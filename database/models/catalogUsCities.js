const { databaseOperations } = require('./index')

class catalogUsCities extends databaseOperations {
  constructor() {
    super('catalogUsCities')
  }
}

module.exports = new catalogUsCities()
