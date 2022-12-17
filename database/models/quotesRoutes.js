const { databaseOperations } = require('./index')

class quotesRoutes extends databaseOperations {
  constructor() {
    super('quotesRoutes')
  }
}

module.exports = new quotesRoutes()
