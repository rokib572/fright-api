const { databaseOperations } = require('./index')

class contact extends databaseOperations {
  constructor() {
    super('contacts')
  }
}

module.exports = new contact()
