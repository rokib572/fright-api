const { databaseOperations } = require('./index')

class locationsReceiving extends databaseOperations {
  constructor() {
    super('locationsReceiving')
  }
}

module.exports = new locationsReceiving()
