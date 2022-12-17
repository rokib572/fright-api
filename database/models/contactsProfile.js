const { databaseOperations } = require('./index')

class contactProfile extends databaseOperations {
  constructor() {
    super('contactsProfile')
  }
}

module.exports = new contactProfile()
