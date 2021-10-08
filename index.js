'use strict'

const whatwgUrl = require('whatwg-url')
const { MongoClient } = require('mongodb')


module.exports = (uri, opts) => {
	if (typeof uri !== 'string') {
		throw new TypeError('Expected uri to be a string')
	}

  const dbName = whatwgUrl.basicURLParse(uri).path.toString()
  if (!dbName) {
		throw new Error('Database name not found in connection string')
	}

	opts = opts || {}
	const property = opts.property || 'db'
	delete opts.property

	let connection

	return function expressMongoDb(req, res, next) {
		if (!connection) {
			connection = MongoClient.connect(uri, opts)
		}

		connection
			.then(function (db) {
				req[property] = db.db(dbName)
				next()
			})
			.catch(function (err) {
				connection = undefined
				next(err)
			})
	}
}
