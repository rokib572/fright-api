const { databaseOperations } = require('./index')

class catalogPort extends databaseOperations {
  constructor() {
    super('catalogPorts')
  }
}

module.exports = new catalogPort()
