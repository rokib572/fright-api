const { databaseOperations } = require('./index')

class catalogWorldCities extends databaseOperations {
  constructor() {
    super('catalogWorldCities')
  }
}

module.exports = new catalogWorldCities()
