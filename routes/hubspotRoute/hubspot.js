const auth = require(`${__base}utils/auth`)

const { getHubSpot } = require('../../database/repo/hubspot/hubspotRepo')
const logger = require(`${__base}/utils/logger`)

const hubspot = async (app) => {
  app.get('/api/hubspot/data', auth, async (req, res, next) => {
    try {
      let createdBy = req.userId
      const response = await getHubSpot(createdBy)
      res.status(200).json({ msg: 'Success', hubspot: response })
    } catch (err) {
      err.message === 'HTTP request failed'
        ? logger.error(JSON.stringify(err.response, null, 2))
        : logger.error(err)
      next(err)
    }
  })
}

module.exports = hubspot
