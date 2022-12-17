const { databaseOperations } = require('./index')

class catalogAirport extends databaseOperations {
  constructor() {
    super('catalogAirports')
  }
}

module.exports = new catalogAirport()
