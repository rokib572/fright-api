const { databaseOperations } = require('./index')

class envVariables extends databaseOperations {
  constructor() {
    super('envVariables')
  }
}

module.exports = new envVariables()
