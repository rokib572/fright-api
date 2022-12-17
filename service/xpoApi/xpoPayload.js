const getWeight = require('../../utils/getWeight')

const xpoPayload = (data) => {
  let commodities = []
  data.pieces.map((piece) => {
    commodities.push({
      grossWeight: {
        weight: getWeight(piece, 'lbs'),
        weightUom: 'LBS',
      },
      dimensions: {
        length: Number(piece.dimLength),
        width: Number(piece.dimWidth),
        height: Number(piece.dimHeight),
        dimensionsUom: 'INCH',
      },
      nmfcClass: piece.freightClass,
      pieceCnt: piece.quantity,
    })
  })

  const payload = {
    shipmentInfo: {
      paymentTermCd: 'P',
      bill2Party: {
        acctInstId: '568460087',
      },
      commodity: commodities,
      consignee: {
        address: {
          postalCd: data.destination.postalCode,
        },
      },
      shipper: {
        address: {
          postalCd: data.origin.postalCode,
        },
      },
      shipmentDate: new Date().toISOString(),
    },
  }
  return payload
}

module.exports = xpoPayload
