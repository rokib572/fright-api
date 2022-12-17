const { databaseOperations } = require('./index')

class dotCarrier extends databaseOperations {
  constructor() {
    super('dotCarriers')
  }
}

module.exports = new dotCarrier()
