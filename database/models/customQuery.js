const { databaseOperations } = require('./index')

class customQuery extends databaseOperations {
  constructor() {
    super('customQuery')
  }
}

module.exports = new customQuery()
