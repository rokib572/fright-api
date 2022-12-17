const auth = require(`${__base}utils/auth`)
const userRepo = require(`${__base}database/repo/staff/userRepo`)
const validate = require(`${__base}utils/validate`)
const authService = require(`${__base}service/authService`)
const logger = require(`${__base}utils/logger`)
const { errorResponse } = require(`${__base}helpers`)
const {
    API_STUFF_USERS,
    API_STUFF_USERS_LOGIN,
    API_SINGLE_STUFF_USERS,
    API_STUFF_USERS_TOKEN,
    API_STUFF_USERS_FORGOT_PASSWORD,
    API_STUFF_USERS_RESET_PASSWORD,
    API_STUFF_USERS_CONTACT_CARD,
} = require('./userApiRoutes')
const {
    userCreateSchema,
    userUpdateSchema,
    contactCardUpdateSchema,
} = require('./userSchema')

const usersStaff = async (app) => {
    // user register
    app.post(
        API_STUFF_USERS,
        validate(userCreateSchema),
        auth,
        async (req, res) => {
            // #swagger.tags = ['UserStaff']
            const userObj = {}
            userObj.firstName = req.body.firstName
            userObj.lastName = req.body.lastName
            userObj.email = req.body.email
            userObj.password = req.body.password
            const createdBy = req.userId
            try {
                var response = await userRepo.saveUser(userObj, createdBy)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('DB Error in usersStaff function, error ->>', err)
                return res
                    .status(500)
                    .send(errorResponse('Something went wrong in server', 500))
            }
        }
    )

    // user Login
    app.post(API_STUFF_USERS_LOGIN, async (req, res, next) => {
        const { email, password } = req.body
        // #swagger.tags = ['UserStaff']
        if (!email || !password) {
            return res
                .status(400)
                .json(errorResponse('Email and Password are required', 400))
        }
        try {
            var response = await userRepo.verifyLogin(email, password)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in user login', err)
            next(err)
        }
    })

    app.get(API_STUFF_USERS_TOKEN, async (req, res, next) => {
        // #swagger.tags = ['UserStaff']
        if (!req.params.token) {
            return res.status(400).json(errorResponse('Token is required', 400))
        }

        try {
            const tokenInfo = await authService.verifyToken(req.params.token)
            if (!tokenInfo) {
                return res.status(400).json(errorResponse('Invalid Token', 400))
            }
            return res.status(200).json(tokenInfo)
        } catch (err) {
            next(err)
        }
    })

    // get all users
    app.get(API_STUFF_USERS, auth, async (req, res) => {
        // #swagger.tags = ['UserStaff']
        try {
            const page = req.query.page || false
            const result = await userRepo.getUsers(page)
            return res.status(result.statusCode).send(result)
        } catch (error) {
            return res.status(error.statusCode).send(error)
        }
    })

    // get user by id
    app.get(API_SINGLE_STUFF_USERS, auth, async (req, res) => {
        // #swagger.tags = ['UserStaff']
        try {
            const { id } = req.params

            const response = await userRepo.getUserStaffById(id)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in getting user staff', err)
            return res.status(500).send(err)
        }
    })

    // delete user by Id
    app.delete(API_SINGLE_STUFF_USERS, auth, async (req, res) => {
        // #swagger.tags = ['UserStaff']
        try {
            const { id } = req.params
            if (!id) {
                return res.status(400).send('Id is required')
            } else {
                const response = await userRepo.deleteUser(id)
                return res.status(response.statusCode).send(response)
            }
        } catch (e) {
            logger.error('Error in deleting user staff', e)
            return res.status(500).send(e)
        }
    })

    // update user by Id
    app.patch(
        API_SINGLE_STUFF_USERS,
        auth,
        validate(userUpdateSchema),
        async (req, res, next) => {
            // #swagger.tags = ['UserStaff']
            const userObj = req.body
            const { id } = req.params
            try {
                const response = await userRepo.updateUser(id, userObj)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                next(err)
            }
        }
    )

    /// check if email is already exist, if exists then generate a forgot password token and send it to the user's email
    app.get(API_STUFF_USERS_FORGOT_PASSWORD, async (req, res) => {
        const email = req.params.email
        try {
            // #swagger.tags = ['UserStaff']
            const tokenResult = await userRepo.forgotPasswordToken(email)
            return res.status(tokenResult.statusCode).send(tokenResult)
        } catch (err) {
            return res.status(500).send(err)
        }
    })

    // reset password
    app.patch(API_STUFF_USERS_RESET_PASSWORD, async (req, res) => {
        const token = req.params.token
        const password = req.body.password

        if (!password) {
            return res.status(400).json(errorResponse('Password is required'))
        }

        try {
            const result = await userRepo.resetPassword(token, password)
            return res.status(200).json(result)
        } catch (err) {
            logger.error('Error in resetting password', err)
            return res.status(500).json('Error in resetting password')
        }
    })

    // GET users/staff/:id/contactCard
    app.get(API_STUFF_USERS_CONTACT_CARD, async (req, res) => {
        try {
            const { id } = req.params
            const response = await userRepo.getUserContactCard(id)
            return res.status(response.statusCode).send(response)
        } catch (err) {
            logger.error('Error in getting user contact card', err)
            return res.status(500).send(err)
        }
    })

    // PATCH users/staff/:id/contactCard
    app.patch(
        API_STUFF_USERS_CONTACT_CARD,
        auth,
        validate(contactCardUpdateSchema),
        async (req, res) => {
            try {
                const { id } = req.params
                const data = req.body
                data['modifiedBy'] = req.userId
                const response = await userRepo.updateUserContactCard(id, data)
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('Error in updating user contact card', err)
                return res.status(500).send(err)
            }
        }
    )
}

module.exports = usersStaff
