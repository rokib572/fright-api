const { databaseOperations } = require('./index')

class AwsFiles extends databaseOperations {
  constructor() {
    super('files')
  }
}

module.exports = new AwsFiles()
