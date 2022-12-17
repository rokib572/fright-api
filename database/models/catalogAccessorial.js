const { databaseOperations } = require('./index')

class catalogAccessorial extends databaseOperations {
  constructor() {
    super('catalogAccessorials')
  }
}

module.exports = new catalogAccessorial()
