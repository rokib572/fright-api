const { generateUUID } = require(`${__base}service/authService`)
const credential = require('../../models/credentials')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const { encrypt } = require('../../../service/passwordEncryptionService')

const columns = [
    'id',
    'label',
    'category',
    'webAddress',
    'userName',
    'password',
    'division',
]

const saveCredential = async (data) => {
    try {
        const {
            category,
            label,
            webAddress,
            userName,
            password,
            division,
            createdBy,
            modifiedBy,
        } = data

        let userNameRemoveSpace = userName.split(' ').join('')
        let passwordRemoveSpace = password.split(' ').join('')

        const credentialObj = {}

        //Create userObject
        credentialObj['category'] = category.trim()
        credentialObj['label'] = label.trim()
        credentialObj['webAddress'] = webAddress.trim()
        credentialObj['userName'] = userNameRemoveSpace.trim()
        credentialObj['division'] = division.trim()
        credentialObj['createdBy'] = createdBy
        credentialObj['modifiedBy'] = modifiedBy

        //Generate GUI ID
        let credentialId = await generateUUID()
        let encPassword = await encrypt(passwordRemoveSpace.trim())

        credentialObj['id'] = credentialId
        credentialObj['password'] = encPassword

        await credential.save(credentialObj)
        return successResponse(credentialObj)
    } catch (e) {
        logger.error('Error on Save_credentials Function err=>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Get Credentials  By parameter

const getCredential = async (page, limit) => {
    let where = {
        isDeleted: 0,
    }
    try {
        let credentials
        if (page) {
            credentials = await credential.get({
                where,
                columns,
                page,
                limit: limit,
                orderBy: 'label ASC',
            })
        } else {
            credentials = await credential.get({
                where,
                columns,
                orderBy: 'label ASC',
            })
        }
        const response = {
            statusCode: 200,
            status: 'success',
        }
        if (credentials.length > 0) {
            const response = {
                statusCode: 200,
                status: 'success',
            }
            response.page = page ? page : 1
            response.limit = page
                ? `${(page - 1) * limit + 1}-${page * limit}`
                : `1-${credentials.length}`
            response.result = credentials
            return response
        }
    } catch (e) {
        logger.error('Error in getUsers_function, error ->>', e)
        return errorResponse('Something went wrong in server', 400)
    }
}

const getCredentialsById = async (id) => {
    try {
        const result = await credential.get({
            where: {
                id,
                isDeleted: 0,
            },
            columns,
        })
        if (result.length > 0) {
            return successResponse(result[0])
        } else {
            return errorResponse('No Credentials Found')
        }
    } catch (e) {
        logger.error('Error in getCredentials, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

const credentialsUpdate = async (where, data) => {
    try {
        if (data.category || data.label || data.webAddress || data.division) {
            if (data.userName) {
                let userNameRemoveSpace = data.userName.split(' ').join('')

                data.userName = userNameRemoveSpace
            }

            if (data.password) {
                let passwordRemoveSpace = data.password.split(' ').join('')
                let encPassword = await encrypt(passwordRemoveSpace.trim())
                data.password = encPassword
            }

            delete data.createdAt
            delete data.createdBy
            delete data.id
        }
        let result = await credential.update(data, where)
        return result
    } catch (err) {
        logger.error('Error in credential_function, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

module.exports = {
    saveCredential,
    credentialsUpdate,
    getCredential,
    getCredentialsById,
}
