const { databaseOperations } = require('./index')

class credential extends databaseOperations {
  constructor() {
    super('credentials')
  }
}

module.exports = new credential()
