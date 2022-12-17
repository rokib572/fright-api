const { databaseOperations } = require('./index')

class catalogServiceType extends databaseOperations {
    constructor() {
        super('catalogServiceTypes')
    }
}

module.exports = new catalogServiceType()
