const doTheMath = require("./dothemath");
const { successResponse, errorResponse } = require(`${__base}helpers`)

const kalculatorService = (dataInput) => {

    try{
      
      let result  = doTheMath(dataInput.quantities, dataInput.convertDimsFrom, 
        dataInput.convertDimsTo, dataInput.convertWeightFrom, dataInput.convertWeightTo);

        return successResponse(result);

    }catch(error){
      return errorResponse(error.message);
    }
}

module.exports = kalculatorService