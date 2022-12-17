const { databaseOperations } = require('./index')

class usersLocation extends databaseOperations {
  constructor() {
    super('locations')
  }
}

module.exports = new usersLocation()