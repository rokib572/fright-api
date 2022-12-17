const util = require("util");
const multer = require("multer");
const { saveDotCarrierLog } = require("../database/repo/tool/dotCarrierRepo");

const upload = async (req, res, fileName, fileVersion)=>{
  try{
    let originalFile;
    let storedFileName = fileName+'.txt';
    
    let storage = multer.diskStorage({
      destination: (req, file, cb) => {
        let filesDir = __base + "resources/uploads/dot_carriers";
        cb(null, filesDir);
      },
      filename: (req, file, cb) => {
        originalFile = file;
        cb(null, storedFileName);
      },
    });
    
    let uploadFile = multer({
      storage: storage,
      limits: {},
      fileFilter: (req, file, cb) => {
        let isValid = true;
        
        if(file.mimetype != 'text/plain'){
          isValid = false;
          cb(new Error('Invalid file type.'))
        }
        cb(null, isValid)
      }
    }).single("file");

    let uploadFileMiddleware = util.promisify(uploadFile);

    await uploadFileMiddleware(req, res);
    if(originalFile){
      let logData = {};
      logData['originalFileName'] = originalFile?.originalname;
      logData['storedFileName'] = storedFileName;
      logData['fileVersion'] = fileVersion;
      logData['isProcessed'] = 0;
      await saveDotCarrierLog(logData);
    }

  }catch(error){
    throw new Error(error?.message);
  }
}

module.exports = upload;