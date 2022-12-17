const { databaseOperations } = require('./index')

class usersStaffTokens extends databaseOperations {
  constructor() {
    super('usersStaffTokens')
  }
}

module.exports = new usersStaffTokens()
