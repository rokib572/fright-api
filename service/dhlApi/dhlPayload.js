const getWeight = require("../../utils/getWeight");

const dhlPayload = (data, vApi) => {

  let packages = [];
  data.pieces.map((piece)=>{
    packages.push({
        weight: Number(getWeight(piece, 'lbs')), 
        dimensions: {
          length: Number(piece.dimLength),
          width: Number(piece.dimWidth),
          height: Number(piece.dimHeight),
        }
      })
  })

    const payload = {
      customerDetails: {
        shipperDetails: {
          postalCode: data.origin.postalCode,
          cityName: data.origin.city,
          countryCode: data.origin.country
        },
        receiverDetails: {
          postalCode: data.destination.postalCode,
          cityName: data.destination.city,
          countryCode: data.destination.country
        }
      },
      accounts: [
        {
          typeCode: "shipper", 
          number: vApi.accountNumber
        }
      ],
      plannedShippingDateAndTime: new Date().toISOString(),
      unitOfMeasurement: "metric",
      isCustomsDeclarable: false,
      packages: packages
    }
    return payload
  }
  
module.exports = dhlPayload
  