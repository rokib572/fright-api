const getWeight = require(`${__base}utils/getWeight`)
const {getVendorsApi} = require(`${__base}service/getVenodrsApi`)
const xmlBody = async (requestObject) => {
  const estesCredentials = await getVendorsApi('www.estes-express.com')
  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rat="http://ws.estesexpress.com/ratequote" xmlns:rat1="http://ws.estesexpress.com/schema/2019/01/ratequote">
  <soapenv:Header>
     <rat:auth>
        <rat:user>${estesCredentials.userName}</rat:user>
        <rat:password>${estesCredentials.password}</rat:password>
     </rat:auth>
  </soapenv:Header>
  <soapenv:Body>
     <rat1:rateRequest>
        <rat1:requestID>test1234</rat1:requestID>
        <rat1:account>B008478</rat1:account>
        <rat1:originPoint>
           <rat1:countryCode>${requestObject.origin.country}</rat1:countryCode>
            <rat1:postalCode>${requestObject.origin.postalCode}</rat1:postalCode>
            <rat1:city>${requestObject.origin.city}</rat1:city>
            <rat1:stateProvince>${requestObject.origin.province}</rat1:stateProvince>
        </rat1:originPoint>
        <rat1:destinationPoint>
            <rat1:countryCode>${requestObject.destination.country}</rat1:countryCode>
            <rat1:postalCode>${requestObject.destination.postalCode}</rat1:postalCode>
            <rat1:city>${requestObject.destination.city}</rat1:city>
            <rat1:stateProvince>${requestObject.destination.province}</rat1:stateProvince>
        </rat1:destinationPoint>
        <rat1:payor>${requestObject.role? requestObject.role: 'T'}</rat1:payor>
        <rat1:terms>${requestObject.terms? requestObject.terms: 'P'}</rat1:terms>
        <rat1:pickup>
           <rat1:date>${getToday()}</rat1:date>${
            requestObject.available ? 
            `
            <rat1:ready>${requestObject.available}</rat1:ready>` : ''
           }${
            requestObject.close ? 
            `
            <rat1:close>${requestObject.close}</rat1:close>` : ''}
        </rat1:pickup>
        <rat1:declaredValue>${requestObject.declaredValue? requestObject.declaredValue: 0}</rat1:declaredValue>
        <rat1:declaredValueWaived>${'Y'}</rat1:declaredValueWaived>
        <rat1:stackable>${requestObject.stackable? requestObject.stackable: 'N'}</rat1:stackable>${
         requestObject.linearFeet ? 
         `
         <rat1:linearFeet>${requestObject.linearFeet}</rat1:linearFeet>` : ''
        }
        ${
         requestObject.foodWarehouse?
         `<rat1:foodWarehouse>${requestObject.foodWarehouse}</rat1:foodWarehouse>`
         : ''
        }
        <rat1:fullCommodities>
        ${requestObject.pieces
          .map((piece) => {
            return `<rat1:commodity>
                <rat1:class>${piece.freightClass}</rat1:class>
                  <rat1:weight>${getWeight(piece, 'lbs')}</rat1:weight>
                  <rat1:pieces>${piece.quantity}</rat1:pieces>
                  <rat1:pieceType>${getQuantityType(piece)}</rat1:pieceType>
                  <rat1:dimensions>
                    <rat1:length>${piece.dimLength}</rat1:length>
                    <rat1:width>${piece.dimWidth}</rat1:width>
                    <rat1:height>${piece.dimHeight}</rat1:height>
                  </rat1:dimensions>
                </rat1:commodity>`
          })
          .join('')}
        </rat1:fullCommodities>
        ${requestObject.accessorials && requestObject.accessorials.length > 0 ? 
            `<rat1:accessorials>
            ${requestObject.accessorials.map((accessorial) => 
               `<rat1:accessorialCode>${accessorial}</rat1:accessorialCode>`)
               .join('')}
         </rat1:accessorials>`: ''}
     </rat1:rateRequest>
  </soapenv:Body>
  </soapenv:Envelope>`
}

module.exports = xmlBody

// get today date with format like 'YYYY-MM-DD'
const getToday = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  return `${yyyy}-${mm}-${dd}`
}

const getQuantityType = (piece) => {
  let quantityType = piece.quantityType.toLowerCase()
  if (quantityType === 'pallet') {
    return 'PT'
  }
  if (quantityType === 'carton') {
    return 'CT'
  }
  if (quantityType === 'box') {
    return 'BX'
  }
  if (quantityType === 'tote' || quantityType === 'totebin') {
    return 'TO'
  }
  if (quantityType === 'roll') {
    return 'RL'
  }
  return piece.quantityType
}