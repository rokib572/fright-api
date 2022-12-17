const DateTime = require('../../utils/DateTime')
const getWeight = require('../../utils/getWeight')
const {getVendorsApi} = require(`${__base}service/getVenodrsApi`)
module.exports = async (data) => {
  const yrcCredentials = await getVendorsApi('www.yrc.com')
  let originCountry, destinationCountry;
  data.origin.country = data.origin.country.toLowerCase()
  data.destination.country = data.destination.country.toLowerCase()
  originCountry = data.origin.country
  destinationCountry = data.destination.country
  if(data.origin.country =='us'){
    originCountry = 'usa'
  }
  if(data.destination.country =='us'){
    destinationCountry = 'usa'
  }
  if(data.origin.country =='ca'){
    originCountry = 'can'
  }
  if(data.destination.country =='ca'){
    destinationCountry = 'can'
  }
  return {
    login: {
      username: yrcCredentials.userName,
      password: yrcCredentials.password,
      busId: yrcCredentials.accountNumber,
      busRole: 'Third Party',
      paymentTerms: 'Prepaid',
    },
    details: {
      serviceClass: 'STD',
      typeQuery: 'QUOTE',
      pickupDate: formatDate(DateTime.getCurrentTime()), // YYYYMMDD
      productCode: 'DFQ',
    },
    originLocation: {
      city: data.origin.city,
      state: data.origin.province,
      postalCode: data.origin.postalCode,
      country: originCountry,
      locationType: data.origin?.locationType ? data.origin.locationType : 'COMM',
    },
    destinationLocation: {
      city: data.destination.city,
      state: data.destination.province,
      postalCode: data.destination.postalCode,
      country: destinationCountry,
      locationType: data.destination?.locationType ? data.destination.locationType : 'COMM',
    },
    listOfCommodities: {
      commodity: data.pieces.map((piece) => {
        return {
          packageLength: piece.dimLength,
          packageWidth: piece.dimWidth,
          packageHeight: piece.dimHeight,
          weight: getWeight(piece, 'lbs'), 
          handlingUnits: piece.quantity,
          packageCode: getQuantityType(piece),
        }
      }),
    },
    serviceOpts: {
      accOptions: data.accessorials,
    },
  }
}

const formatDate = date => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`
}

const getQuantityType = (piece) => {
  let quantityType = piece.quantityType.toLowerCase()
  if (quantityType === 'pallet') {
    return 'PLT'
  }
  if (quantityType === 'carton') {
    return 'CTN'
  }
  if (quantityType === 'drum') {
    return 'DRM'
  }
  if (quantityType === 'skids') {
    return 'SKD'
  }
  return 'PLT'
}