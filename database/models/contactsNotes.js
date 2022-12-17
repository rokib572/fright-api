const { databaseOperations } = require('./index')

class contactsNotes extends databaseOperations {
  constructor() {
    super('contactsNotes')
  }
}

module.exports = new contactsNotes()