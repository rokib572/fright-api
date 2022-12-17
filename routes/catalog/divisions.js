const auth = require(`${__base}utils/auth`)
const logger = require(`${__base}/utils/logger`)

const divisionsRepo = require('../../database/repo/catalog/divisionsRepo')
const divisions = (app) => {
    app.get('/api/catalog/divisions', auth, async (req, res, next) => {
        try {
            // #swagger.tags = ['Catalog']
            var columns = ['label']
            const response = await divisionsRepo.getAllDivisions(columns)

            return res.status(response.statusCode).send(response)
        } catch (e) {
            logger.error('Error in get all divisions ', e)
            return res.status(500).send(e)
        }
    })
}

module.exports = divisions
