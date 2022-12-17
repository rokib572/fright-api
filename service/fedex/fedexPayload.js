const fedexPayload = (data) => {
  let pieces = data.pieces
  let { totalWeight, piece, count } = pics(pieces)
  let payload = {
    accountNumber: {
      value: data.vApi.accountNumber,
    },
    rateRequestControlParameters: {
      returnTransitTimes: true,
      servicesNeededOnRateFailure: true,
    },
    requestedShipment: {
      shipper: {
        address: {
          city: data.origin.city,
          stateOrProvinceCode: data.origin.province.toUpperCase(),
          postalCode: data.origin.postalCode,
          countryCode: data.origin.country.toUpperCase(),
          residential: false,
        },
      },
      recipient: {
        address: {
          city: data.destination.city,
          stateOrProvinceCode: data.destination.province.toUpperCase(),
          postalCode: data.destination.postalCode,
          countryCode: data.destination.country.toUpperCase(),
          residential: false,
        },
      },
      rateRequestType: ['ACCOUNT'],
      pickupType: 'CONTACT_FEDEX_TO_SCHEDULE',
      preferredCurrency: 'USD',
      requestedPackageLineItems: piece,
    },
    totalPackageCount: count,
    totalWeight: totalWeight,
    carrierCodes: data.accessorials,
  }

  return payload
}

const pics = (dataObj) => {
  let totalWeight = 0
  let count = 0
  let wgh = 'KG'

  let piece = new Array()
  dataObj.map((data) => {
    let type =
      data.quantityType.toLowerCase() === 'tote'
        ? 'TOTEBIN'
        : data.quantityType.toLowerCase() === 'pl'
        ? 'PALLET'
        : data.quantityType.toUpperCase()
    if (data.weightType.toLowerCase() === 'lbs') {
      wgh = 'LB'
    } else {
      wgh = 'KG'
    }
    let obj = {
      subPackagingType: type,
      weight: {
        units: wgh,
        value: data.totalWeight,
      },
      dimensions: {
        length: data.dimLength,
        width: data.dimWidth,
        height: data.dimHeight,
        units: 'IN',
      },
    }
    totalWeight += data.totalWeight
    count++
    piece.push(obj)
  })
  return { totalWeight, piece, count }
}

module.exports = { fedexPayload }
