const { databaseOperations } = require('./index')

class usersStaffContactCards extends databaseOperations {
  constructor() {
    super('usersStaffContactCards')
  }
}

module.exports = new usersStaffContactCards()
