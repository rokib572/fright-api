const awsFile = require("../../models/awsFiles");
const { successResponse, errorResponse } = require(`${__base}helpers`);
const logger = require(`${__base}/utils/logger`);
const customQuery = require('../../models/customQuery')

const saveFile = async (fileObject) => {
  try {
    await awsFile.save(fileObject);
    return successResponse("File saved successfully");
  } catch (e) {
    logger.error("Error on file save Function err=>", e);
    return errorResponse("Something went wrong in server", 500);
  }
};

const updateDbFile = async (fileObject, fileId) => {
  try {
    await awsFile.update(fileObject, {
      where: {
        id: fileId,
      },
    });
    return successResponse("File updated successfully");
  } catch (e) {
    logger.error("Error on updateDbFile Function err=>", e);
    return errorResponse("Something went wrong in server", 500);
  }
};

const getFile = async (fileId) => {
  try {
    let files = await awsFile.get({
      where: {
        id: fileId,
      },
    });

    return files.length > 0 ? files[0] : null;
  } catch (e) {
    logger.error("Error on getFile Function err=>", e);
    return null;
  }
};

const getAllFiles = async (params = {}) => {
  try {
    let files = await awsFile.get(params);
    return files;
  } catch (e) {
    logger.error("Error on getAllFiles Function err=>", e);
    return [];
  }
};

const deleteDbFile = async (fileId) => {
  try {
    await awsFile.delete({
      where: {
        id: fileId,
      },
    });
    return successResponse("File deleted successfully.");
  } catch (e) {
    logger.error("Error in deleteFile_function: error ->>", e);
    return errorResponse(e.message, 500);
  }
};

const getsearchFile = async (params) => {
  try {
    let whereSql = "";
    if (params.fileName) {
      whereSql += `(name LIKE "%${params.fileName}%") `;
    }

    if (params.fileType) {
      if (whereSql) whereSql += `AND `;
      whereSql += `(mimeType = "${params.fileType}") `;
    }

    if (params.createdBy) {
      if (whereSql) whereSql += `AND `;
      whereSql += `(createdBy = "${params.createdBy}") `;
    }

    if (params.createdDate) {
      if (whereSql) whereSql += `AND `;
      whereSql += `date(createdDate) = "${params.createdDate}" `;
    }

    if (params.updatedBy) {
      if (whereSql) whereSql += `AND `;
      whereSql += `modifiedBy = "${params.updatedBy}" `;
    }

    if (params.updatedDate) {
      if (whereSql) whereSql += `AND `;
      whereSql += `date(modifiedDate) = "${params.updatedDate}" `;
    }

    if (whereSql) {
      whereSql = " WHERE " + whereSql;
    }

    let sql = `SELECT * FROM files ${whereSql} `;
    const result = await customQuery.query(sql);

	return successResponse(result);
  } catch (err) {
    logger.error("Error on getFileSearch Function err=>", err);
    return errorResponse("Something went wrong in server", 500);
  }
};

module.exports = {
  saveFile,
  updateDbFile,
  getFile,
  getAllFiles,
  deleteDbFile,
  getsearchFile,
};
