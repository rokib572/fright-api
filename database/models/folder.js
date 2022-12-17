const { databaseOperations } = require('./index')

class folder extends databaseOperations {
  constructor() {
    super('folders')
  }
}

module.exports = new folder()
