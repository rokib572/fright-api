const { databaseOperations } = require('./index')

class vendorsOcean extends databaseOperations {
  constructor() {
    super('vendorsOcean')
  }
}

module.exports = new vendorsOcean()
