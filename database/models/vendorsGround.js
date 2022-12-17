const { databaseOperations } = require('./index')

class vendorsGround extends databaseOperations {
  constructor() {
    super('vendorsGround')
  }
}

module.exports = new vendorsGround()
