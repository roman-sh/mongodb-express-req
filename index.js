const whatwgUrl = require('whatwg-url')
const { MongoClient } = require('mongodb')


module.exports = (uri, opts = {}) => {
	if (typeof uri !== 'string') {
		throw new TypeError('Expected uri to be a string')
	}

  const dbName = whatwgUrl.basicURLParse(uri).path.toString()
  if (!dbName) {
		throw new Error('Database name not found in connection string')
	}

	const property = opts.property || 'db'
	delete opts.property

	let connection

	return async function expressMongoDb(req, res, next) {
    console.log(`mongodb_connection: ${!!connection}`)
		if (!connection) {
      try {
        const res = await MongoClient.connect(uri, opts)
        connection = true
        req[property] = res.db(dbName)
				next()
      }
      catch (e) {
        connection = false
				next(e)
      }
		}
	}
}
