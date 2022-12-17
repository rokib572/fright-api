const { databaseOperations } = require('./index')

class dedicatedRates extends databaseOperations {
  constructor() {
    super('dedicatedRates')
  }
}

module.exports = new dedicatedRates()
