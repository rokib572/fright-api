const xmlToJson = require(`${__base}utils/xmlJsonConverter`)

module.exports = (xml) => {
  try{

    const jsonResponse = JSON.parse(
      xmlToJson({
        xml: xml,
      })
    )
  
    let imageResp = jsonResponse['soapenv:Envelope']['soapenv:Body']?.['imag:imgResponse']?.['imag:images'];
  
    if (imageResp) {
      const images = imageResp['imag:image']
  
      let response = [];
      if(images?.length > 0){
        images.map((res)=>{
          
          response.push({
            fileName: res['imag:fileName']['_text'],
            fileSource: res['imag:source']['_text']
          });
  
        })
      }
  
      return {
        data: response
      };
  
    }else{ 
      return {
        error: true,
        message: 'Could not get response from Estes'
      };    
    }

  }catch(err){
    return {
      error: true,
      message: err?.message
    };
  }
}
