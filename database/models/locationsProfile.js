const { databaseOperations } = require('./index')

class locationsProfile extends databaseOperations {
  constructor() {
    super('locationsProfile')
  }
}

module.exports = new locationsProfile()
