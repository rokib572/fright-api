const { databaseOperations } = require('./index')

class usersStaffForgotPassword extends databaseOperations {
  constructor() {
    super('usersStaffForgotPassword')
  }
}

module.exports = new usersStaffForgotPassword()
