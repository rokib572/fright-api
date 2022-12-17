const { SERVICE_LEVEL_STANDARD_VOL, SERVICE_LEVEL_STANDARD, SERVICE_LEVEL_GUARANTEED_TRUCKLOAD } = require("../../../utils/serviceLevels");

const xmlToJson = require(`${__base}utils/xmlJsonConverter`)

const getServiceLevel = (serviceLevel) => {
  if (serviceLevel.startsWith('Guaranteed LTL Standard Transit')) {
    return SERVICE_LEVEL_STANDARD;
  }

  switch (serviceLevel) {
    case 'Volume and Truckload Basic':
      return SERVICE_LEVEL_STANDARD_VOL;
    case 'LTL Standard Transit':
      return SERVICE_LEVEL_STANDARD;
    case 'Guaranteed Exclusive Use':
      return SERVICE_LEVEL_GUARANTEED_TRUCKLOAD;
    default:
      return serviceLevel;
  }
}

module.exports = (xml) => {
  const jsonResponse = JSON.parse(
    xmlToJson({
      xml: xml,
    })
  )

  if (
    jsonResponse['soapenv:Envelope']['soapenv:Body']['rat:rateQuote'][
    'rat:quoteInfo'
    ]['rat:quote']
  ) {
    const result =
      jsonResponse['soapenv:Envelope']['soapenv:Body']['rat:rateQuote'][
      'rat:quoteInfo'
      ]['rat:quote']
    const responseArray = []
    result.map((item) => {
      responseArray.push({
        quoteId: item['rat:quoteNumber']['_text'],
        totalRate: parseFloat(
          item['rat:pricing']['rat:totalPrice']['_text']
        ).toFixed(2),
        totalRateUnit: `USD`,
        serviceLevel: getServiceLevel(item['rat:serviceLevel']['rat:text']['_text']),
        transitTime: `${item['rat:serviceLevel']['rat:lane']['_text']} days`,
      })
    })
    return responseArray
  } else {
    return 'Could not get response from Estes'
  }
}
