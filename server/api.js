'use strict';

var express = require('express')
var uuid = require('node-uuid')
var Datastore = require('nedb')
var router = express.Router()
var appdb = new Datastore({ filename: './.dbs/app', autoload: true})
var classdb = new Datastore({ filename: './.dbs/class', autoload: true})
var COMPACT_INTER = 10*1000

appdb.persistence.setAutocompactionInterval(COMPACT_INTER)
classdb.persistence.setAutocompactionInterval(COMPACT_INTER)

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
			res.json(resp(null, result))
		}
	})
})
router.post('/apps', function (req, res) {
	appdb.insert(req.body, function (err, result) {
		res.json(resp(err, result))
	})
})
router.put('/apps/:id', function (req, res) {
	var doc = req.body || {}
	var id = req.params.id
	doc._id = id
	doc._updated_time = +new Date
	appdb.update({_id: id}, doc, {upsert: true}, function (err, count, result) {
		if (err || !result) return res.json(resp(err, result || {}))

		var created_time = +new Date
		if (!result._id) {
			// update
			res.json(resp(null, result, 1301))
		} else {
			// create
			appdb.update({_id: id}, {$set: {'_created_time': created_time}}, function () {
				result.created_time = created_time
				res.json(resp(err, result, 1302))
			})
		}
	})
})
router.patch('/apps/:id', function (req, res) {
	var doc = req.body || {}
	var id = req.params.id
	doc._updated_time = +new Date
	appdb.update({_id: id}, {$set: doc}, {}, function (err, count) {
		if (err) res.json(resp(err))
		else if (!count) res.jsoin('[' + id + '] is not exist.', null, 1401) // not found
		else {
			res.json(null, {}, 1402) // update success
		}
	})
})
router.delete('/apps/:id', function (req, res) {
	var id = req.params.id
	appdb.remove({_id: id}, {multi: true}, function (err, count) {
		if (err) res.json(resp(err))
		else if (!count)  res.json(null, null, 1501) // not found
		else {
			res.json(null, {}, 1502)
		}
	})
})


/**
 * Class
 * GET    /classes/:class
 * GET    /classes/:class/:id
 * GET    /classes/:class/:id
 * POST   /classes/:class
 * PUT    /classes/:class/:id
 * PATCH  /classes/:class/:id
 * DELETE /classes/:class/:id
 */


module.exports = router