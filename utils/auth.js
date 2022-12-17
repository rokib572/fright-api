const jwt = require('jsonwebtoken')
const { checkUserStaffToken } = require(`${__base}database/repo/staff/userRepo`)
const logger = require(`${__base}utils/logger`)
const { errorResponse } = require(`${__base}helpers`)

module.exports = async (req, res, next) => {
    const token = req.headers['x-auth-token']
    if (!token) {
        const error = errorResponse('No token, authorization denied', 401)
        return res.status(401).json(error)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const resStaffToken = await checkUserStaffToken(decoded.userId)
        if (resStaffToken) {
            req.userId = decoded.userId
            next()
        } else {
            const error = errorResponse(
                'You must be logged in to perform this action.',
                401
            )
            return res.status(401).json(error)
        }
    } catch (err) {
        logger.error('Auth function error ==> ', err)
        const error = errorResponse('Your token is invalid.')
        return res.status(400).json(error)
    }
}
