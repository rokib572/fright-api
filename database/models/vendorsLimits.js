const { databaseOperations } = require('./index')

class vendorsLimits extends databaseOperations {
  constructor() {
    super('vendorsLimits')
  }
}

module.exports = new vendorsLimits()
