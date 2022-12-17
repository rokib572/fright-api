const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)
const catalogServiceTypeRepo = require('../../database/repo/catalog/catalogServiceTypeRepo')
const catalogServiceTypes = (app) => {
    app.get('/api/catalog/servicetypes', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            var columns = ['id', 'label']
            const response =
                await catalogServiceTypeRepo.getAllCatalogServiceType(columns)

            return res.status(response.statusCode).send(response)
        } catch (e) {
            logger.error('Error in get all catalog Service TypeRepo-->> ', e)
            return res.status(500).send(e)
        }
    })
}

module.exports = catalogServiceTypes
