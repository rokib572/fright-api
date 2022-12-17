const { databaseOperations } = require('./index')

class usersStaff extends databaseOperations {
  constructor() {
    super('usersStaff')
  }
}

module.exports = new usersStaff()
