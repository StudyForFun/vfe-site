'use strict';

var express = require('express')
var Datastore = require('nedb')
var router = express.Router()
var mkdirp = require('mkdirp')
var path = require('path')
mkdirp.sync(path.join(process.cwd(), '../.dbs'))
var appdb = new Datastore({ filename: '../.dbs/app', autoload: true})
var classdb = new Datastore({ filename: '../.dbs/class', autoload: true})
var COMPACT_INTER = 10*1000

appdb.persistence.setAutocompactionInterval(COMPACT_INTER)
classdb.persistence.setAutocompactionInterval(COMPACT_INTER)
classdb.ensureIndex({fieldName: '_app_id'})

function resp(err, data, code) {
	if (err) return {error: err, code: code || 500}
	else return {data: data, code: code || 200}
}

/**
 * APP
 * GET    /apps			code: 10xx
 * GET    /apps/:id 	code: 11xx
 * POST   /apps 		code: 12xx
 * PUT    /apps/:id 	code: 13xx
 * PATCH  /apps/:id 	code: 14xx
 * DELETE /apps/:id 	code: 15xx
 */
router.get('/apps', function (req, res) {
	appdb.find({}, function (err, results) {
		res.json(resp(err, results))
	})
})
router.get('/apps/:id', function (req, res) {
	appdb.findOne({_id: req.params.id}, function (err, result) {
		if (err) {
			res.json(resp(err))
		} else {
			if (!result) {
				res.json(resp(null, result))
			} else {
				res.json(resp('[' + id + '] is not exist.', null, 1101))
			}
		}
	})
})
router.post('/apps', function (req, res) {
	var doc = req.body || {}
	doc._updated_time = doc._created_time = +new Date
	appdb.insert(req.body, function (err, result) {
		res.json(resp(err, result))
	})
})
router.put('/apps/:id', function (req, res) {
	var doc = req.body || {}
	var id = req.params.id
	doc._id = id
	var created_time = doc._updated_time = +new Date
	appdb.update({_id: id}, doc, {upsert: true}, function (err, count, result) {
		if (err || !result) return res.json(resp(err, result || {}))

		if (!result._id) {
			// update
			res.json(resp(null, {_id: id}))
		} else {
			// create
			appdb.update({_id: id}, {'$set': {'_created_time': created_time}}, function () {
				result.created_time = created_time
				res.json(resp(err, result, 1301))
			})
		}
	})
})
router.patch('/apps/:id', function (req, res) {
	var doc = req.body || {}
	var id = req.params.id
	doc._updated_time = +new Date
	appdb.update({_id: id}, {'$set': doc}, {}, function (err, count) {
		if (err) res.json(resp(err))
		else if (!count) res.json(resp('[' + id + '] is not exist.', null, 1401)) // not found
		else {
			res.json(resp(null, {_id: id})) // update success
		}
	})
})
router.delete('/apps/:id', function (req, res) {
	var id = req.params.id
	appdb.remove({_id: id}, {multi: true}, function (err, count) {
		if (err) res.json(resp(err))
		else if (!count) res.json(resp(null, {_id: id}, 1501)) // not found
		else {
			res.json(resp(null, {_id: id}))
		}
	})
})


/**
 * Class
 * GET    /classes/:class         code: 20xx
 * GET    /classes/:class/:id     code: 21xx
 * POST   /classes/:class 		  code: 22xx
 * PUT    /classes/:class/:id 	  code: 23xx
 * PATCH  /classes/:class/:id 	  code: 24xx
 * DELETE /classes/:class/:id 	  code: 25xx
 */
router.get('/classes/:class', function (req, res) {
	classdb.find({
			_class: req.params.class, 
			_app_id: req.query._app_id
		},
		function (err, results) {
			res.json(resp(err, results))
		})
})
router.get('/classes/:class/:id', function (req, res) {
	var id = req.params.id
	classdb.findOne({
			_id: id, 
			_class: req.params.class, 
			_app_id: req.query._app_id
		}, 
		function (err, result) {
			if (err) {
				res.json(resp(err))
			} else {
				if (!result) {
					res.json(resp('[' + id + '] is not exist.', null, 2101))
				} else {
					res.json(resp(null, result))
				}
			}
		})
})
router.post('/classes/:class', function (req, res) {
	var doc = req.body || {}
	var id = doc._id
	doc._app_id = req.query._app_id
	doc._class = req.params.class
	doc._updated_time = doc._created_time = +new Date
	classdb.insert(doc, function (err, result) {
		// already exist
		if (!err && !result && id) return res.json(resp('[' + id + '] is already exist.', null, 2201))
		res.json(resp(err, result))
	})
})
router.put('/classes/:class/:id', function (req, res) {
	var doc = req.body || {}
	var id = req.params.id
	var clazz = req.params.class
	var app_id = req.query._app_id
	var query = {
		_id: id,
		_class: clazz,
		_app_id: app_id
	}
	doc._id = id
	doc._class = clazz
	doc._app_id = app_id

	var created_time = doc._updated_time = +new Date
	classdb.update(query, doc, {upsert: true}, function (err, count, result) {
		if (err || !result) return res.json(resp(err, result || {}))

		if (!result._id) {
			// update
			res.json(resp(null, result, 2301))
		} else {
			// create
			classdb.update(query, {'$set': {'_created_time': created_time}}, function () {
				result.created_time = created_time
				res.json(resp(err, result, 2302))
			})
		}
	})
})
router.patch('/classes/:class/:id', function (req, res) {
	var doc = req.body || {}
	var id = req.params.id
	var clazz = req.params.class
	var app_id = req.query._app_id

	doc._updated_time = +new Date
	classdb.update({_id: id, _class: clazz, _app_id: app_id}, {'$set': doc}, {}, function (err, count) {
		if (err) res.json(resp(err))
		else if (!count) res.json('[' + id + '] is not exist.', null, 1401) // not found
		else {
			res.json(resp(null, {_id: id})) // update success
		}
	})
})
router.delete('/classes/:class/:id', function (req, res) {
	var id = req.params.id
	var clazz = req.params.class
	var app_id = req.query._app_id

	classdb.remove({_id: id, _class: clazz, _app_id: app_id}, {multi: true}, function (err, count) {
		if (err) res.json(resp(err))
		else if (!count)  res.json(resp(null, {_id: id}, 2501)) // not found
		else {
			res.json(resp(null, {_id: id}))
		}
	})
})


module.exports = router