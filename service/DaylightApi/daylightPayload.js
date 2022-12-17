const getWeight = require("../../utils/getWeight");

const pickupItem = ['Lift Gate Pickup', 'LIFT GATE PICKUP', 
'Limited Access or Constr Site Pickup', 'LIMITED ACCESS OR CONSTR SITE PICKUP', 
'Inside Pickup', 'INSIDE PICKUP'];

const deliveryItem = ['Residential Delivery', 'RESIDENTIAL DELIVERY', 
'Inside Delivery', 'INSIDE DELIVERY', 
'Limited Access or Constr Site Dlvry', 'LIMITED ACCESS OR CONSTR SITE DLVRY', 
'Lift Gate Delivery', 'LIFT GATE DELIVERY', 
'Appointment Fee', 'APPOINTMENT FEE', 
'Overlength 8 ft but less than 12 ft', 'OVERLENGTH 8 FT BUT LESS THAN 12 FT', 
'Overlength 12 ft but less than 20 ft', 'OVERLENGTH 12 FT BUT LESS THAN 20 FT', 
'Overlength 20 ft or greater', 'OVERLENGTH 20 FT OR GREATER'];

const otherItem = ['Compliance Services Fee', 'COMPLIANCE SERVICES FEE'];

const getAccName = (accId) =>{
  
  if(pickupItem.includes(accId)){
    return 'P';
  }else if(deliveryItem.includes(accId)){
    return 'D'
  }else if(otherItem.includes(accId)){
    return 'O';
  }else{
    return '';
  }
}

const daylightPayload = (data, vApi) => {

  let pieceItems = [];
  data.pieces.map((piece)=>{
    pieceItems.push({
      pcs: piece.quantity,
      pallets: piece.quantity,
      weight: getWeight(piece, 'lbs'),
      actualClass: piece.freightClass,
    })
  })
  
  let payload = {
    dyltRateQuoteReq: {
      accountNumber: vApi.accountNumber,
      userName: vApi.userName,
      password: vApi.password,
      billTerms: 'PP',
      shipperInfo: {
        customerAddress: {
          city: data.origin.city,
          state: data.origin.province,
          zip: data.origin.postalCode,
        },
      },
      consigneeInfo: {
        customerAddress: {
          city: data.destination.city,
          state: data.destination.province,
          zip: data.destination.postalCode,
        },
      },
      items: {
        item: pieceItems
      }
    }
  }

  if(data.accessorials && data.accessorials.length > 0){

    let accessorials = [];
    data.accessorials.map((accessorialId)=>{
      accessorials.push({
        accName: getAccName(accessorialId),
        accId: accessorialId,
      });
    })

    payload.dyltRateQuoteReq.accessorials = {};
    payload.dyltRateQuoteReq.accessorials.accessorial = accessorials;
  }

  return payload
}

module.exports = daylightPayload
