const { databaseOperations } = require('./index')

class locationsShipping extends databaseOperations {
  constructor() {
    super('locationsShipping')
  }
}

module.exports = new locationsShipping()
