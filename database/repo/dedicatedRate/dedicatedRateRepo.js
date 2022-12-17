const { generateUUID } = require(`${__base}service/authService`);
const dedicatedRates = require("../../models/dedicatedRates");
const { successResponse, errorResponse } = require("../../../helpers");
const usersStaff = require("../../models/usersStaff");
const logger = require("../../../utils/logger");
const customQuery = require("../../models/customQuery");

const saveDedicatedRate = async (dedicatedRate) => {
  try {
    let isUser = await checkUserID(dedicatedRate.createdBy);
    if (isUser) {
      dedicatedRate.id = await generateUUID();
      await dedicatedRates.save(dedicatedRate);

      return successResponse("Dedicated Rate saved successfully");
    }
    return errorResponse("User not found");
  } catch (e) {
    logger.error("error on dedicated rate repo response--->", e.message);
    return errorResponse(e, 500);
  }
};

const checkUserID = async (Id) => {
  try {
    const isID = await usersStaff.get({
      where: {
        id: Id,
        isDeleted: 0,
      },
    });
    if (isID.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    logger.error("error on quotes repo checkUserID response--->", e.message);
  }
};

const getDedicatedRates = async (params) => {
  try {
    let serviceType = params.serviceType;
    let origin = params.origin;
    let destination = params.destination;

    let whereCondition = {
      serviceType: serviceType,
      originCity: origin,
      destinationCity: destination,
    };

    const result = await dedicatedRates.get({
      where: whereCondition,
    });

    return successResponse(result);
  } catch (error) {
    logger.error("Error on getDedicatedRates fuction->", error);
    return errorResponse("Failed to get dedicated rates", 500);
  }
};

const searchDedicatedRates = async (params) => {
  try {
    // const result = await dedicatedRates.get({
    //     where: whereCondition
    // })

    // return successResponse(result);

    let sql = "SELECT * FROM dedicatedRates ";
    let searchFilter = "";

    let originCity = params.originCity;
    let originProvince = params.originProvince;
    let originPostalCode = params.originPostalCode;
    let originStationCode = params.originStationCode;
    let destinationCity = params.destinationCity;
    let destinationProvince = params.destinationProvince;
    let destinationPostalCode = params.destinationPostalCode;
    let destinationStationCode = params.destinationStationCode;

    //#region origin logic check
    if (originCity != "") {
      searchFilter += " originCity = '" + originCity + "'";
    }
    if (originProvince != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter += " originProvince = '" + originProvince + "'";
    }
    if (originPostalCode != "" && originStationCode != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter +=
        " (originPostalCode = '" +
        originPostalCode +
        "'" +
        " OR originStationCode = '" +
        originStationCode +
        "'" +
        ") ";
    } else if (originPostalCode != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter += " originPostalCode = '" + originPostalCode + "'";
    } else if (originStationCode != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter += " originStationCode = '" + originStationCode + "'";
    }
    //#endregion

    //#region destination Logic check
    if (destinationCity != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter += " destinationCity = '" + destinationCity + "'";
    }
    if (destinationProvince != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter += " destinationProvince = '" + destinationProvince + "'";
    }
    if (destinationPostalCode != "" && destinationStationCode != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter +=
        " (destinationPostalCode = '" +
        destinationPostalCode +
        "'" +
        " OR destinationStationCode = '" +
        destinationStationCode +
        "'" +
        ") ";
    } else if (destinationPostalCode != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter +=
        " destinationPostalCode = '" + destinationPostalCode + "'";
    } else if (destinationStationCode != "") {
      if (searchFilter != "") {
        searchFilter += " AND ";
      }
      searchFilter +=
        " destinationStationCode = '" + destinationStationCode + "'";
    }
    //#endregion

    if (searchFilter != "") {
      sql += " where " + searchFilter;
    }

    const result = await customQuery.query(sql);
    if (result.length === 0) {
      return errorResponse("No vendors found", 404);
    }
    const response = {
      statusCode: 200,
      status: "success",
    };
    return successResponse(result);
  } catch (error) {
    logger.error("Error on searchDedicatedRates fuction->", error);
    return errorResponse("Failed to search dedicated rates", 500);
  }
};

module.exports = {
  saveDedicatedRate,
  getDedicatedRates,
  searchDedicatedRates,
};
