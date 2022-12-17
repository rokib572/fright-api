const { successResponse, errorResponse } = require(`${__base}helpers`)

const yrcDocumentService = async (data) =>{

    try{
        return successResponse(data)
    } catch (err) {
        return errorResponse("Can't get response from YRC service")
    }
}

module.exports = yrcDocumentService