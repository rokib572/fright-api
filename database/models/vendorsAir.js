const { databaseOperations } = require('./index')

class vendorsAir extends databaseOperations {
  constructor() {
    super('vendorsAir')
  }
}

module.exports = new vendorsAir()
