const { getToday } = require("../../utils/DateTime");
const getWeight = require("../../utils/getWeight");

const forwardAirPayload = (requestObject, vApi) => {

    const payload = `<?xml version='1.0' encoding='UTF-8'?>
    <FAQuoteRequest>
        <BillToCustomerNumber>${vApi.accountNumber}</BillToCustomerNumber>
        <ShipperCustomerNumber>${vApi.accountNumber}</ShipperCustomerNumber>
        <Origin>
            <OriginAirportCode/>
            <OriginZipCode>${requestObject.origin.postalCode}</OriginZipCode>
            <OriginCountryCode>${requestObject.origin.country}</OriginCountryCode>
            <Pickup>
                <AirportPickup>N</AirportPickup>
            </Pickup>
        </Origin>
        <Destination>
            <DestinationAirportCode/>
            <DestinationZipCode>${requestObject.destination.postalCode}</DestinationZipCode>
            <DestinationCountryCode>${requestObject.destination.country}</DestinationCountryCode>
            <Delivery>
                <AirportDelivery>N</AirportDelivery>
            </Delivery>
        </Destination>
        <FreightDetails>
        ${requestObject.pieces.map((piece)=>{
            return `<FreightDetail>
                <Weight>${getWeight(piece, 'lbs')}</Weight>
                <WeightType>L</WeightType>
                <Pieces>${piece.quantity}</Pieces>
                <FreightClass>${piece.freightClass}</FreightClass>
            </FreightDetail>`
        })}
        </FreightDetails>
        <Dimensions>
        ${requestObject.pieces.map((piece)=>{
            return `<Dimension>
                <Pieces>${piece.quantity}</Pieces>
                <Length>${piece.dimLength}</Length>
                <Width>${piece.dimWidth}</Width>
                <Height>${piece.dimHeight}</Height>
            </Dimension>`
        })}
        </Dimensions>
        <Hazmat>N</Hazmat>
        <InBondShipment>N</InBondShipment>
        <ShippingDate>${getToday()}</ShippingDate>
    </FAQuoteRequest>`;

    return payload;
}

module.exports = forwardAirPayload