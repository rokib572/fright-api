const { databaseOperations } = require('./index')

class vendorsAPI extends databaseOperations {
  constructor() {
    super('vendorsAPI')
  }
}

module.exports = new vendorsAPI()
