const { databaseOperations } = require('./index')

class catalogAirline extends databaseOperations {
  constructor() {
    super('catalogAirlines')
  }
}

module.exports = new catalogAirline()
