const { databaseOperations } = require('./index')

class catalogTimeZone extends databaseOperations {
  constructor() {
    super('catalogTimeZones')
  }
}

module.exports = new catalogTimeZone()
