const { databaseOperations } = require('./index')

class usersStaffLogs extends databaseOperations {
  constructor() {
    super('usersStaffLogs')
  }
}

module.exports = new usersStaffLogs()
