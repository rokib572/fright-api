const auth = require(`${__base}utils/auth`)
const credentialRepo = require(`${__base}database/repo/credential/credentialRepo`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const validate = require(`${__base}utils/validate`)
const getUtcTime = require(`${__base}utils/getUTCTime`)
const { decrypt } = require(`${__base}service/passwordEncryptionService`)
const {
    getTimeZoneByLocation,
} = require('../../service/timeZoneDbApi/timeZoneDbApiService')
const {
    credentialCreateSchema,
    credentialUpdateSchema,
} = require('./credentialSchemaValidation')
const credentialStaff = async (app) => {
    //Credential  insert

    app.post(
        '/api/credentials/',
        auth,
        validate(credentialCreateSchema),
        async (req, res, next) => {
            const credentialObj = req.body
            // #swagger.tags = ['Credential']
            credentialObj.createdBy = req.userId
            credentialObj.modifiedBy = req.userId
            try {
                var response = await credentialRepo.saveCredential(
                    credentialObj
                )

                let password = await decrypt(response.result.password)
                response.result.password = password
                return res.status(response.statusCode).send(response)
            } catch (err) {
                logger.error('DB Error in credentials function, error ->>', err)
                return res
                    .status(500)
                    .send(errorResponse('Something went wrong in server', 500))
            }
        }
    )

    //Get all credentails

    app.get('/api/credentials', auth, async (req, res, next) => {
        //returns all active credential staffs
        if (!req.query.page) {
            try {
                // #swagger.tags = ['Credential']
                const response = await credentialRepo.getCredential()
                if (!response.result) {
                    return res.status(response.statusCode).send(response)
                }

                for (let i = 0; i < response.result.length; i++) {
                    let password = await decrypt(response.result[i].password)
                    response.result[i].password = password
                }
                return res.status(response.statusCode).send(response)
            } catch (err) {
                next(err)
            }
        }

        //returns by paginating
        else {
            try {
                let page = req.query.page
                if (!Number.isInteger(parseInt(page))) {
                    return res.status(400).json({
                        statusCode: '400',
                        status: 'error',
                        error: 'Page Number Is Not Valid',
                    })
                }
                if (page === '0') {
                    page = '1'
                }
                let limit = 10
                const response = await credentialRepo.getCredential(page, limit)

                if (!response) {
                    return res
                        .status(400)
                        .send(errorResponse('credentials Not found'))
                }

                for (let i = 0; i < response.result.length; i++) {
                    var password = await decrypt(response.result[i].password)
                    response.result[i].password = password
                }

                return res.status(200).send(response)
            } catch (e) {
                next(e)
            }
        }
    })

    //Get Credential by id

    app.get('/api/credentials/:id', auth, async (req, res, next) => {
        try {
            // #swagger.tags = ['Credential']
            const { id } = req.params

            const response = await credentialRepo.getCredentialsById(id)

            if (response.statusCode === 400) {
                return res.status(response.statusCode).send(response)
            }

            let password = await decrypt(response.result.password)
            response.result.password = password
            return res.status(response.statusCode).send(response)
        } catch (err) {
            next(err)
            return errorResponse(err.message, 400)
        }
    })

    //Delete Credential by Id

    app.delete('/api/credentials/:id', auth, async (req, res, next) => {
        try {
            // #swagger.tags = ['Credential']
            const { id } = req.params
            if (!id) {
                return res.status(404).Json({ message: 'Id Not found' })
            }

            let credentialObj = {}
            credentialObj.isDeleted = 1
            let where = {
                where: {
                    id: id,
                    isDeleted: 0,
                },
            }
            const result = await credentialRepo.credentialsUpdate(
                where,
                credentialObj
            )
            let success = ''
            if (result) {
                success = successResponse('Data Deletion Successfully', 200)
            } else {
                success = errorResponse('Data Deletion Failed', 400)
            }

            return res.status(200).send(success)
        } catch (e) {
            logger.error('Error at Update Credential Repo->', e)
            return errorResponse(e.message, 400)
        }
    })

    // Credential Update by Id

    app.patch(
        '/api/credentials/:id',
        auth,
        validate(credentialUpdateSchema),
        async (req, res, next) => {
            // #swagger.tags = ['Credential']
            //returns all active user staffs
            const {
                category,
                label,
                webAddress,
                userName,
                password,
                division,
            } = req.body
            const credentialObj = {}
            credentialObj['category'] = category
            credentialObj['label'] = label
            credentialObj['webAddress'] = webAddress
            credentialObj['division'] = division

            if (userName) {
                credentialObj['userName'] = userName
            }
            if (password) {
                credentialObj['password'] = password
            }

            const { id } = req.params
            credentialObj.modifiedBy = req.userId
            credentialObj.lastModified = getUtcTime()

            try {
                let where = {
                    where: {
                        id: id,
                        isDeleted: 0,
                    },
                }
                const result = await credentialRepo.credentialsUpdate(
                    where,
                    credentialObj
                )
                let success = ''
                if (result) {
                    success = successResponse('Data Updated Successfully', 200)
                } else {
                    success = errorResponse('Data  Updated Failed', 400)
                }
                return res.status(200).send(success)
            } catch (err) {
                logger.error('Error at Update Credential Repo', err)
                return errorResponse(err.message, 400)
            }
        }
    )
}

module.exports = credentialStaff
