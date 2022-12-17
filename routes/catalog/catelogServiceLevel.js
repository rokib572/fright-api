const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)
const catalogServiceLevelRepo = require('../../database/repo/catalog/catelogServiceLevelRepo')
const catalogServiceLevels = (app) => {
    app.get('/api/catalog/servicelevels', auth, async (req, res) => {
        try {
            // #swagger.tags = ['Catalog']
            var columns = ['id', 'label']
            const response =
                await catalogServiceLevelRepo.getAllCatalogServiceLevel(columns)

            return res.status(response.statusCode).send(response)
        } catch (e) {
            logger.error('Error in get all catalog Service TypeRepo-->> ', e)
            return res.status(500).send(e)
        }
    })
}

module.exports = catalogServiceLevels
