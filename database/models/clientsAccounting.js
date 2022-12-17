const { databaseOperations } = require('./index')

class clientsAccounting extends databaseOperations {
  constructor() {
    super('clientsAccounting')
  }
}

module.exports = new clientsAccounting()
