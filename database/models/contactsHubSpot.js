const { databaseOperations } = require('./index')

class contactsHubSpot extends databaseOperations {
  constructor() {
    super('contactsHubSpot')
  }
}

module.exports = new contactsHubSpot()
