const { databaseOperations } = require('./index')

class catalogDivision extends databaseOperations {
  constructor() {
    super('catalogDivisions')
  }
}

module.exports = new catalogDivision()
