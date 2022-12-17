const { databaseOperations } = require('./index')

class quotes extends databaseOperations {
  constructor() {
    super('quotes')
  }
}

module.exports = new quotes()
