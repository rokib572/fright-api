const { databaseOperations } = require('./index')

class contactsLocations extends databaseOperations {
  constructor() {
    super('contactsLocations')
  }
}

module.exports = new contactsLocations()