const getWeight = require('../../utils/getWeight')

const getConvertedFreightClass = (freightClass) => {
    if (!isNaN(freightClass)) {
        let fClass = Number(freightClass) * 10
        if (String(fClass).length < 4) {
            fClass = '0' + fClass
        }
        return fClass
    }
    return freightClass
}

const jpExpressPayload = (requestObject, vApi) => {
    const payload = `<?xml version='1.0' encoding='utf-8'?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <GetRates xmlns='http://jpxpress.com/'>
      <userName>${vApi.userName}</userName>
      <password>${vApi.password}</password>
      <rateAccount>${vApi.accountNumber}</rateAccount>
      <payee>ThirdParty</payee>
      <paymentMethod>PrePaid</paymentMethod>
      <originZip>${requestObject.origin.postalCode}</originZip>
      <destZip>${requestObject.destination.postalCode}</destZip>
      <parameters>
        ${requestObject.pieces.map(
            (piece) => `<RateParameter>
        <Weight>${getWeight(piece, 'lbs')}</Weight>
        <Pallets>${piece.quantity}</Pallets>
        <Class>${getConvertedFreightClass(piece.freightClass)}</Class>
    </RateParameter>`
        )}
      </parameters>
      <isCod>false</isCod>
      ${
          requestObject.accessorials && requestObject.accessorials.length > 0
              ? `
        <accessorials>
            ${requestObject.accessorials.map(
                (accessorial) => `<string>${accessorial}</string>`
            )}
        </accessorials>
      `
              : ''
      }
    </GetRates>
  </soap12:Body>
</soap12:Envelope>`

    return payload
}

module.exports = jpExpressPayload
