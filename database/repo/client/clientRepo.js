const { generateUUID } = require(`${__base}service/authService`)
const client = require('../../models/clients')
const clientsAccounting = require('../../models/clientsAccounting')
const customQuery = require('../../models/customQuery')
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const getUtcTime = require(`${__base}utils/getUTCTime`)
const { validate: isUUID } = require('uuid')

const columns = [
    'id',
    'locationsId',
    'clientSince',
    'credit',
    'paymentTerms',
    'creditLimit',
    'entityId',
    'parentLocation',
    'salesperson',
    'identificationNumber',
    'division',
    'paperworkRequired',
    'paperworkTypes',
]

const saveClient = async (data) => {
    try {
        let {
            locationsId,
            clientSince,
            credit,
            paymentTerms,
            creditLimit,
            entityId,
            parentLocation,
            salesperson,
            identificationNumber,
            division,
            paperworkRequired,
            paperworkTypes,
            createdBy,
            modifiedBy,
            identificationType,
        } = data

        let clientObj = {}
        clientObj['locationsId'] = locationsId
        clientObj['credit'] = credit
        clientObj['paymentTerms'] = paymentTerms
        clientObj['creditLimit'] = creditLimit
        clientObj['entityId'] = entityId
        clientObj['parentLocation'] = parentLocation
        clientObj['salesperson'] = salesperson
        clientObj['identificationNumber'] = identificationNumber
        clientObj['division'] = division
        clientObj['paperworkRequired'] = paperworkRequired
        clientObj['createdBy'] = createdBy
        clientObj['modifiedBy'] = modifiedBy
        clientObj['identificationType'] = identificationType
        clientObj['clientSince'] = getUtcTime(clientSince)

        if (paperworkTypes) {
            const jsonStr = JSON.stringify(paperworkTypes)
            const isValidJson = isJsonValid(jsonStr)
            if (isValidJson) {
                clientObj['paperworkTypes'] = jsonStr
            } else {
                return errorResponse('Json Object is Invalid')
            }
        }

        //Generate GUI ID
        let clientId = await generateUUID()

        clientObj['id'] = clientId
        const isExists = await locationIdIsExists(locationsId)
        if (isExists) {
            let where = {
                where: {
                    locationsId,
                    blackListed: 0,
                },
            }
            const result = await clientUpdate(where, clientObj)
            return result
        } else {
            if (isValidUUid(locationsId)) {
                await client.save(clientObj)
                return successResponse('Data insertion successfully')
            }
            return errorResponse('Location id is Not Valid uuid', 500)
        }
    } catch (e) {
        logger.error('Error on Save_clients Function err=>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Client Update Function
const clientUpdate = async (where, data) => {
    try {
        let clientObj = {}

        clientObj['clientSince'] = data.clientSince
        clientObj['paymentTerms'] = data.paymentTerms
        clientObj['credit'] = data.credit
        clientObj['creditLimit'] = data.creditLimit
        clientObj['entityId'] = data.entityId
        clientObj['parentLocation'] = data.parentLocation
        clientObj['salesperson'] = data.salesperson
        clientObj['identificationNumber'] = data.identificationNumber
        clientObj['identificationType'] = data.identificationType
        clientObj['division'] = data.division
        clientObj['paperworkRequired'] = data.paperworkRequired
        clientObj['modifiedBy'] = data.modifiedBy
        clientObj['modifiedDate'] = getUtcTime()

        if (data.paperworkTypes) {
            const jsonStr = JSON.stringify(data.paperworkTypes)
            const isValidJson = isJsonValid(jsonStr)
            if (isValidJson) {
                clientObj['paperworkTypes'] = jsonStr
            } else {
                return errorResponse('Json Object is Invalid')
            }
        }

        let result = await client.update(clientObj, where)
        if (result) {
            return successResponse('Data updated successfully')
        } else {
            return errorResponse('Data Updated Failed')
        }
    } catch (err) {
        logger.error('Error in client update function, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Client Update Function
const clientDelete = async (where, data) => {
    try {
        let result = await client.update(data, where)
        if (result) {
            return successResponse('Data Deletion successfully')
        }
        return errorResponse('Data Deletion Failed')
    } catch (err) {
        logger.error('Error in client delete function, error ->>', err)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Get All Clients

const getAllClients = async (column, page, limit) => {
    let sql = `SELECT  ${column}
              FROM 
                clients as cl LEFT JOIN
                (SELECT * FROM locations as l WHERE l.isDeleted=0) as loc 
              ON 
                cl.locationsId=loc.id 
              WHERE 
                cl.blackListed =0`
    try {
        if (page) {
            sql += ` ORDER BY loc.companyName ASC `
            sql += ` LIMIT ${limit} OFFSET ${(page - 1) * limit} `
        } else {
            sql += ` ORDER BY loc.companyName ASC `
        }

        const result = await customQuery.query(sql)

        let clients = new Array()
        for (let i = 0; i < result.length; i++) {
            let client = {}
            let loc = {}
            let cli = {}
            cli.clientId = result[i].clientId
            cli.clientSince = result[i].clientSince
            cli.credit = result[i].credit
            cli.paymentTerms = result[i].paymentTerms
            cli.creditLimit = result[i].creditLimit
            cli.entityId = result[i].entityId
            cli.parentLocation = result[i].parentLocation
            cli.salesperson = result[i].salesperson
            cli.identificationNumber = result[i].identificationNumber
            cli.identificationType = result[i].identificationType
            cli.division = result[i].division
            cli.paperworkRequired = result[i].paperworkRequired
            cli.paperworkTypes = result[i].paperworkTypes
            client.clientsInfo = cli

            loc.locationsId = result[i].locationsId
            loc.companyName = result[i].companyName
            loc.companyAddress1 = result[i].companyAddress1
            loc.companyAddress2 = result[i].companyAddress2
            loc.companyCity = result[i].companyCity
            loc.companyProvince = result[i].companyProvince
            loc.companyPostalCode = result[i].companyPostalCode
            loc.companyCountry = result[i].companyCountry
            loc.timeZone = result[i].timeZone
            loc.isSFS = result[i].isSFS
            loc.zoneCode = result[i].zoneCode
            loc.latitude = result[i].latitude
            loc.longitude = result[i].longitude

            if (loc.locationsId == null) {
                client.locationsInfo = {}
            } else {
                client.locationsInfo = loc
            }

            clients.push(client)
        }

        if (clients.length === 0) {
            return errorResponse('Clients Not Found')
        }
        const response = {
            statusCode: 200,
            status: 'success',
        }
        response.page = page ? page : 1
        response.limit = page
            ? `${(page - 1) * limit + 1}-${page * limit}`
            : `1-${clients.length}`
        response.result = clients
        return response
    } catch (err) {
        logger.error('error on client get all->', err)
        return errorResponse(err.message)
    }
}

//Get client by Id
const getClientById = async (id) => {
    try {
        const result = await client.get({
            where: {
                id,
                blackListed: 0,
            },
            columns,
        })
        if (result.length > 0) {
            return successResponse(result[0])
        } else {
            return errorResponse('No Client Found')
        }
    } catch (e) {
        logger.error('Error in get Client by id, error ->>', e)
        return errorResponse('Something went wrong in server', 500)
    }
}

//Location id unique check
const locationIdIsExists = async (locationsId) => {
    let where = {
        locationsId: locationsId,
    }
    const isExists = await client.get({ where })
    if (isExists.length > 0) {
        return true
    }
    return false
}

const isValidUUid = (uuid) => {
    return isUUID(uuid) ? true : false
}

const isJsonValid = (jsonObj) => {
    try {
        JSON.parse(jsonObj)
    } catch (e) {
        logger.error('Error in json Object-->>', e)
        return false
    }
    return true
}

const checkClientId = async (clientId) => {
    try {
        const isID = await getClientById(clientId)
        if (isID.length === 0) {
            return false
        }
        return true
    } catch (e) {
        logger.error(
            'error on clients repo checkClientId response--->',
            e.message
        )
        return false
    }
}

const saveClientsAccounting = async (clientsAccountingObj) => {
    try {
        let isClient = await checkClientId(clientsAccountingObj.clientId)
        if (!isClient) {
            return errorResponse('Client not found', 404)
        }
        await clientsAccounting.save(clientsAccountingObj)

        return successResponse('Data saved successfully')
    } catch (err) {
        logger.error('error on clients accounting save-> ', err)
        return errorResponse('Failed to save clients accounting', 500)
    }
}

module.exports = {
    saveClient,
    clientUpdate,
    getAllClients,
    clientDelete,
    getClientById,
    saveClientsAccounting,
}
