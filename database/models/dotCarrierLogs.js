const { databaseOperations } = require('./index')

class dotCarrierLogs extends databaseOperations {
  constructor() {
    super('dotCarrierLogs')
  }
}

module.exports = new dotCarrierLogs()
