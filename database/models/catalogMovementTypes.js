const { databaseOperations } = require('./index')

class catalogMovementTypes extends databaseOperations {
  constructor() {
    super('catalogMovementTypes')
  }
}

module.exports = new catalogMovementTypes()
