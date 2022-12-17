const { successResponse, errorResponse } = require(`${__base}helpers`)

const yrcTrackingService = async (data) =>{

    try{
        return successResponse(data)
    } catch (err) {
        return errorResponse("Can't get response from YRC service")
    }
}

module.exports = yrcTrackingService