const upload  = require(`${__base}utils/upload`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const logger = require(`${__base}/utils/logger`)
const fs = require('fs')
const { getMaxVersionedDotCarrierLogs } = require('../database/repo/tool/dotCarrierRepo')
const fileNamePrefix = 'dot_carriers_data_v';

const uploadService = async (req, res) =>{
    try{
        let filesDir = "./resources/uploads/dot_carriers";
        //if directory not exists then create
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir, { recursive: true })
            console.log("Directory created");
        }

        let data = await getMaxVersionedDotCarrierLogs();
        if(data.length > 0 && data[0].isProcessed == 0){
            return errorResponse("An uploaded file waiting to process.", 409);
        }
        let fileVersion = data.length ? data[0].fileVersion + 1 : 1;
        let newFileName = fileNamePrefix + fileVersion;
        
        await upload(req, res, newFileName, fileVersion);

        return successResponse("File has been successfully uploaded."); 
    }catch(error){
        logger.error('Failed to upload file, err=>', error)
        return errorResponse(error?.message, 500)
    }

}

module.exports = uploadService