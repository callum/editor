module.exports.name = require('./package.json').name
module.exports.version = require('./package.json').version
module.exports.main = require('./main')
module.exports.schema = require('./schema.json')
module.exports.initialData = { text: '' }
module.exports.initialState = {}
