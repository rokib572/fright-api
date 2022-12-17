const { databaseOperations } = require('./index')

class client extends databaseOperations {
  constructor() {
    super('clients')
  }
}

module.exports = new client()
