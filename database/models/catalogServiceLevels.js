const { databaseOperations } = require('./index')

class catalogServiceLevel extends databaseOperations {
    constructor() {
        super('catalogServiceTypes')
    }
}

module.exports = new catalogServiceLevel()
