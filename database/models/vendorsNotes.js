const { databaseOperations } = require('./index')

class vendorsNotes extends databaseOperations {
  constructor() {
    super('vendorsNotes')
  }
}

module.exports = new vendorsNotes()
