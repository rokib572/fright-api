const auth = require(`${__base}utils/auth`)
const freightClassesRepo = require(`${__base}database/repo/catalog/freightClassesRepo`)
const logger = require(`${__base}/utils/logger`)

const freightClasses = (app) => {
    app.get('/api/catalog/freightClasses', async (req, res, next) => {
        try {
            // #swagger.tags = ['Catalog']
            var columns = ['freightClass']
            const response = await freightClassesRepo.getAllFreightClasses(
                columns
            )
            return res.status(response.statusCode).send(response)
        } catch (e) {
            logger.error(e.message)
            next(e)
        }
    })
}

module.exports = freightClasses
