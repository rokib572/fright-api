const { databaseOperations } = require('./index')

class vendor extends databaseOperations {
  constructor() {
    super('vendors')
  }
}

module.exports = new vendor()
