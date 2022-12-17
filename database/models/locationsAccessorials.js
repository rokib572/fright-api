const { databaseOperations } = require('./index')

class locationsAccessorials extends databaseOperations {
  constructor() {
    super('locationsAccessorials')
  }
}

module.exports = new locationsAccessorials()
