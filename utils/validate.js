const { removeFirstAndLastSpace } = require(`${__base}helpers`)

const validate = (schema) => async (req, res, next) => {
  //remove trailing whitespace from request body object key valus.
  if (req.body && req.body.constructor === Object) {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = removeFirstAndLastSpace(value)
      }
    }
  }

  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    return next()
  } catch (err) {
    return res
      .status(400)
      .json({ statusCode: '400', status: 'Request schema error', error: err.message })
  }
}
module.exports = validate
