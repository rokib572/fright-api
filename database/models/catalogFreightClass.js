const { databaseOperations } = require('./index')

class catalogFreightClass extends databaseOperations {
  constructor() {
    super('catalogFreightClasses')
  }
}

module.exports = new catalogFreightClass()
