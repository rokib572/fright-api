const { databaseOperations } = require('./index')

class quotesPieces extends databaseOperations {
  constructor() {
    super('quotesPieces')
  }
}

module.exports = new quotesPieces()
