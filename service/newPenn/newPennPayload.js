const getWeight = require("../../utils/getWeight");

const getConvertedFreightClass = (freightClass) =>{
  if(String(freightClass) == '77.5' || String(freightClass) == '92.5'){
    let fClass = Number(freightClass)*10;
    return String(fClass);
  }
  return freightClass;
}

const newPennPayload = (requestObject, vApi) => {

  let payload =  `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://quoting.newpenn.com" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soapenv:Body>
  <q0:quote>
  <quoteUserId>${vApi.userName}</quoteUserId>
  <quoteWebPassword>${vApi.password}</quoteWebPassword>
  <quotePayor>${vApi.accountNumber}</quotePayor>
  <quoteShipperState>${requestObject.origin.province}</quoteShipperState>
  <quoteShipperCity>${requestObject.origin.city}</quoteShipperCity>
  <quoteShipperZip>${requestObject.origin.postalCode}</quoteShipperZip>
  <quoteConsigneeState>${requestObject.destination.province}</quoteConsigneeState>
  <quoteConsigneeCity>${requestObject.destination.city}</quoteConsigneeCity>
  <quoteConsigneeZip>${requestObject.destination.postalCode}</quoteConsigneeZip>
  <quoteTerms>TRD</quoteTerms>`;

  requestObject.pieces.map((piece, i)=>{
    payload += `<quoteClass${i+1}>${getConvertedFreightClass(piece.freightClass)}</quoteClass${i+1}>
    <quoteWeight${i+1}>${getWeight(piece, 'lbs')}</quoteWeight${i+1}>`;
})

  if(requestObject.accessorials && requestObject.accessorials.length > 0){
    requestObject.accessorials.map((accessorial, i)=>{
      payload += `<quoteAccessorial${i+1}>${accessorial}</quoteAccessorial${i+1}>`
    })
  }

    payload += `<quoteGuaranteedDelivery/>
    </q0:quote>
  </soapenv:Body>
  </soapenv:Envelope>`;

return payload;
}

module.exports = newPennPayload