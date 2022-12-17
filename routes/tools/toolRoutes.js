const auth = require(`${__base}utils/auth`)
const { errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const { getDotCarriers } = require('../../database/repo/tool/dotCarrierRepo')
const { dotCarrierDataProcess } = require('../../service/dotCarrierFileReaderService')

const uploadService = require('../../utils/uploadService')

const toolRoutes = async (app) => {
  app.get('/api/tools/dot', auth, async (req, res) => {
    try {
      let page = req.query.page
      let pageNumber = page ? page : 1
      let result = await getDotCarriers(req.query, pageNumber)
      return res.status(result.statusCode).json(result)
    } catch (err) {
      logger.error('Error on getDot, Function err=>', err)
      return res.status(500).json(errorResponse('Could not get tools dot'))
    }
  })

  app.patch('/api/tools/dot', auth, async (req, res) => {
    try {
      let result = await uploadService(req, res)
      return res.status(result.statusCode).json(result)
    } catch (err) {
      logger.error('Error on update dot, Function err=>', err)
      return res.status(500).json(errorResponse('Could not update dot'))
    }
  })

  app.post('/api/tools/dot/process', auth, async (req, res) => {
    try {
      const result = await dotCarrierDataProcess()
      return res.status(200).json(result)
    } catch (err) {
      logger.error('Error on update dot, Function err=>', err)
      return res.status(500).json(errorResponse('Could not update dot'))
    }
  })
}

module.exports = toolRoutes
