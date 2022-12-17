const { databaseOperations } = require('./index')

class vendorsAccessorials extends databaseOperations {
  constructor() {
    super('vendorsAccessorials')
  }
}

module.exports = new vendorsAccessorials()
