const fs = require('fs');
const events = require('events');
const readline = require('readline');
const logger = require(`${__base}/utils/logger`)
const { successResponse, errorResponse } = require(`${__base}helpers`)
const mySql = require(`${__base}database/dot-carrier-mysql-connect`)
const cron = require('node-cron');

cron.schedule(process.env.DOT_CARRIER_FILE_PROCESS_SCHEDULAR_TIME, async () => {
  await dotCarrierDataProcess();
});


const allColumn = ['dotNumber', 'legalName', 'dbaName', 'carrierOperation', 'hmFlag', 'pcFlag', 
'physicalStreet', 'physicalCity', 'physicalState', 'physicalZip', 'physicalCountry', 
'mailingStreet', 'mailingCity', 'mailingState', 'mailingZip', 'mailingCountry', 
'telephone', 'fax', 'emailAddress', 'mcDate', 'mcMileage', 'mcMileageYear', 
'addDate', 'oicState', 'nbrPowerUnits', 'driverTotal'];

const sqlConnection = () => {
    return true
}

const isDataArrayEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
  
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

const dotCarrierDataProcess = async () => {
    try{
        dotCarrierFileReaderService();
        return successResponse("Data update process started successfully in background.");
    }catch(error){
        logger.error('Error on file read and data insert dotCarrierDataProcess err=>', error)
        return errorResponse("Failed to start process");
    }

}

const dotCarrierFileReaderService = async () =>{
    try{

        logger.info(`Start datetime-> ${new Date()}`);

        let dotCarrierLogDetails = await getUnprocessedDotCarrierLogDetails();

        if(!dotCarrierLogDetails || dotCarrierLogDetails.length == 0){
            return successResponse("Nothing to process");
        }

        let previousLogDetails = await getDotCarrierLogDetailsVersionGreaterThan(dotCarrierLogDetails[0].fileVersion);

        if(!previousLogDetails || previousLogDetails.length == 0){
            return successResponse("Nothing to process");
        }

        const oldFile = readline.createInterface({
            input: fs.createReadStream(__base + `resources/uploads/dot_carriers/${previousLogDetails[0].storedFileName}`),
            output: process.stdout,
            terminal: false,
        });

        let dataObjectOld = {};
        let idx = 0;
        oldFile.on('line', async (line)=>{
            let data = line.replaceAll(/\\+"/g, "\"").match(/("[^"]+"|[^,]+)/g);
            if(idx != 0 && data[0])
                dataObjectOld[data[0]] = data;
            idx = 1;
        });
        await events.once(oldFile, 'close');
        //console.log(`dataObjectOld length-> ${Object.keys(dataObjectOld).length} date-> ${new Date()}`);

        const file = readline.createInterface({
            input: fs.createReadStream(__base + `resources/uploads/dot_carriers/${dotCarrierLogDetails[0].storedFileName}`),
            output: process.stdout,
            terminal: false
        });

        let updateObject = {};
        let insertObject = {};
        idx = 0;
        file.on('line', async (line) => {
            let data = line.replaceAll(/\\+"/g, "\"").match(/("[^"]+"|[^,]+)/g);
            let oldObj = dataObjectOld[data[0]];
            if(idx != 0 && data[0] && oldObj){
                if(!isDataArrayEqual(oldObj, data)){
                    updateObject[data[0]] = data;
                }
            }else if(idx != 0 && data[0]){
                insertObject[data[0]] = data;
            }
            idx = 1;
        });
        await events.once(file, 'close');

        //console.log(`updateObject length-> ${Object.keys(updateObject).length} date-> ${new Date()}`);
        //console.log(`insertObject length-> ${Object.keys(insertObject).length} date-> ${new Date()}`);
        
        let insertItemKeys = Object.keys(insertObject);
        let updateItemKeys = Object.keys(updateObject);
        //return successResponse({insertItems: insertItemKeys.length, updateItems: updateItemKeys.length});

        if(insertItemKeys.length != 0 || updateItemKeys.length != 0){
            //let logSql = `UPDATE dotCarrierLogs SET isProcessed = 0, totalInserted = ${insertItemKeys.length}, totalUpdated = ${updateItemKeys.length} WHERE id = ${dotCarrierLogDetails[0].id}`;
            //await updateDotCarrierLog(logSql);
            processData(updateObject, insertObject, insertItemKeys, updateItemKeys, dotCarrierLogDetails[0].id);
        }else{
            let logSql = `UPDATE dotCarrierLogs SET isProcessed = 1, totalInserted = 0, totalUpdated = 0 WHERE id = ${dotCarrierLogDetails[0].id}`;
            await updateDotCarrierLog(logSql);
            logger.info(`End datetime-> ${new Date()}`);
        }

        return successResponse("Data update process started successfully in background.");

    }catch(err){
        logger.error('Error on file read and data insert err=>', err)
        return errorResponse("Failed to read file");

    }
}

const processData = async (updateObject, insertObject, insertItemKeys, updateItemKeys, dotCarrierlogId) =>{
    try{
        logger.info('data process start');

        let len = insertItemKeys.length;
        const sqlPrefix = `INSERT INTO dotCarriers (${allColumn.join(", ")}) VALUES `;
        let sql = "";
        insertItemKeys.map((key, index)=>{
            
            if(sql != ''){
                sql+=', '
            }

            let data = insertObject[key];
            if(isNaN(data[4].replaceAll("\"","")))
                data[4] = 0;
            if(isNaN(data[5].replaceAll("\"","")))
                data[5] = 0;
            sql+= `(${data.join(', ')})`;

            if((index != 0 && index % 10 == 0) || index == len - 1){
                (async()=>{
                    await saveDotCarrier(sqlPrefix + sql);
                    if(index == len - 1){
                        let logSql = `UPDATE dotCarrierLogs SET isProcessed = 1, totalInserted = ${len} WHERE id = ${dotCarrierlogId}`;
                        await updateDotCarrierLog(logSql);
                        logger.info(`Insert end datetime-> ${new Date()}`);
                    }
                })();
                sql = '';
            }
        })

        let len2 = updateItemKeys.length;
        updateItemKeys.map((key, index)=>{
            (async()=>{
                await saveOrUpdateDotCarrierFromFile(updateObject[key], index, len2, dotCarrierlogId);
            })();
        })
        logger.info('data process end');
    }catch(err){
        logger.error('Failed to process data in =>processData function->>', err)
    }
}

const saveOrUpdateDotCarrierFromFile = async (data, index, len, dotCarrierlogId) =>{
    try{
        let dotNumber = data[0];
        const existedData = await getDotCarrierByDotNumber(dotNumber);
        if(existedData != null){
            
            let dotCarrierObject = {};
            allColumn.map((colName, index)=> {
                if(index == 4 || index == 5 &&  isNaN(data[index])){
                    dotCarrierObject[colName] = 0;
                }else{
                    dotCarrierObject[colName] = data[index].replaceAll("\"","");
                }
            });

            if(existedData.length > 0){
                let response = await updateDotCarrierData(existedData[0].id, dotCarrierObject['dotNumber'], dotCarrierObject);
                if(index == len - 1){
                    let logSql = `UPDATE dotCarrierLogs SET isProcessed = 1, totalUpdated = ${len} WHERE id = ${dotCarrierlogId}`;
                    await updateDotCarrierLog(logSql);
                    logger.info(`Update end datetime-> ${new Date()}`);
                }
                return { success: response != null ? true: false  }
            } else{
                let response = await saveDotCarrierData(dotCarrierObject);
                if(index == len - 1){
                    logger.info(`Update end datetime-> ${new Date()}`);
                }
                return { success: response != null ? true: false }
            }
        } else{
            return { success: false }
        }

    }catch(err){
      logger.error('Failed to save/update dotcarrier, saveOrUpdateDotCarrierFromFile Function err=>', err)
      return { success: false }
    }
}

const getDotCarrierLogDetailsVersionGreaterThan = async (fileVersion) =>{
    try{
        let sql = `SELECT * FROM dotCarrierLogs WHERE fileVersion < ${Number(fileVersion)} ORDER BY id DESC LIMIT 1`;
        return new Promise((resolve, reject) => {
            sqlConnection()
              ? mySql.query(sql, function (err, data) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(Object.values(JSON.parse(JSON.stringify(data))))
                  }
                })
              : reject('Connection to database failed!')
        })
    }catch(error){
        logger.error('getUnprocessedDotCarrierLogDetails Function err=>', error)
        return null;
    }
}

const getUnprocessedDotCarrierLogDetails = async () =>{
    try{
        let sql = `SELECT * FROM dotCarrierLogs WHERE isProcessed=0 LIMIT 1`;
        return new Promise((resolve, reject) => {
            sqlConnection()
              ? mySql.query(sql, function (err, data) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(Object.values(JSON.parse(JSON.stringify(data))))
                  }
                })
              : reject('Connection to database failed!')
        })
    }catch(error){
        logger.error('getUnprocessedDotCarrierLogDetails Function err=>', error)
        return null;
    }
}

const updateDotCarrierLog = async (sql) =>{
    try{
        return new Promise((resolve, reject) => {
            sqlConnection()
              ? mySql.query(sql, (err, data) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(data)
                  }
                })
              : reject('Connection to database failed!')
        })
    }catch(error){
        logger.error('Save error, saveDotCarrierLogData Function err=>', error)
        return null;
    }
  }
  

const saveDotCarrier = async (sql)=>{
    try{
        return new Promise((resolve, reject) => {
            sqlConnection()
              ? mySql.query(sql, (err, data) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(data)
                  }
                })
              : reject('Connection to database failed!')
        })
    }catch(error){
        logger.error('Save error, saveDotCarrierData Function err=>', error)
        return null;
    }
}

const getDotCarrierByDotNumber = async (dotNumber) =>{
    try{
        let sql = `SELECT * FROM dotCarriers WHERE dotNumber='${dotNumber}' LIMIT 1`;
        return new Promise((resolve, reject) => {
            sqlConnection()
              ? mySql.query(sql, function (err, data) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(Object.values(JSON.parse(JSON.stringify(data))))
                  }
                })
              : reject('Connection to database failed!')
        })
    }catch(error){
        logger.error('getDotCarrierByDotNumber Function err=>', error)
        return null;
    }
}

const saveDotCarrierData = async (data) => {
    try{
        let sql = `INSERT INTO dotCarriers SET ?`;
        return new Promise((resolve, reject) => {
            sqlConnection()
              ? mySql.query(sql, data, (err, data) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(data)
                  }
                })
              : reject('Connection to database failed!')
        })
    }catch(error){
        logger.error('Save error, saveDotCarrierData Function err=>', error)
        return null;
    }
}

const updateDotCarrierData = async (id, dotNumber, data) => {
    try{
        let sql = `UPDATE dotCarriers SET ? WHERE dotNumber='${dotNumber}' AND id=${id}`;
        return new Promise((resolve, reject) => {
            sqlConnection()
              ? mySql.query(sql, data, (err, data) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(data)
                  }
                })
              : reject('Connection to database failed!')
        })
    }catch(error){
        logger.error('Update error, updateDotCarrierData Function err=>', error)
        return null;
    }
}

module.exports = {dotCarrierDataProcess, dotCarrierFileReaderService}