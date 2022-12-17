var convert = require('xml-js')
module.exports = ({ xml, json }) => {
  if (json) return convert.json2xml(json, { compact: true, ignoreComment: true, spaces: 4 })
  if (xml) return convert.xml2json(xml, { compact: true, spaces: 4 }) 
  return false
}
