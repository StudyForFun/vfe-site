'use strict';

var express = require('express')
var router = express.Router()
var path = require('path')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var fs = require('fs')

var root = path.join(__dirname, '../.workspace')
function resp(err, data, code) {
	if (err) return {error: err, code: code || 500}
	else return {data: data, code: code || 200}
}

/**
 * GET 		/ws/:app_id?path 		50xx
 * GET 		/ws/:app_id/:file?path 	51xx
 * POST 	/ws/:app_id?path		52xx
 * DELETE   /ws/:app_id?path&type 	53xx
 */
router.get('/ws/:app_id', function (req, res) {
	var app_id = req.params.app_id
	var p = req.query.path || './'

	if (/\.\./.test(p) || /\.\./.test(app_id)) return req.json(resp('Unvalid path or app_id.', null, 5001))

	var dir = path.join(root, app_id, decodeURIComponent(p))
	mkdirp(dir, function () {
		fs.readdir(dir, function (err, files) {
			if (err) return res.json(resp(err))

			files = files.map(function (file) {
				var fpath = path.join(dir, file)
				var stat = fs.statSync(fpath)
				// last modified time
				return {
					file: file,
					type: stat.isDirectory() ? 'dir' : 'file',
					update_time: +stat.mtime,
					size: stat.size
				}
			})
			res.json(resp(null, files))
		})
	})
})
router.post('/ws/:app_id', function (req, res) {
	var app_id = req.params.app_id
	var p = req.body.path || './'
	var filename = req.body.filename

	if (/\.\./.test(p) || /\.\./.test(app_id)) return req.json(resp('Unvalid path or app_id.', null, 5101))
	var dir = path.join(root, app_id, p, filename)
	mkdirp(dir, function (err) {
		if (err) return res.json(resp(err))
		res.json(resp(null, {}))
	})
})
router.delete('/ws/:app_id', function (req, res) {
	var app_id = req.params.app_id
	var type = req.body.type
	var p = req.body.path || './'
	var filename = req.body.filename

	if (/\.\./.test(p) || /\.\./.test(app_id)) return req.json(resp('Unvalid path or app_id.', null, 5101))
	var filepath = path.join(root, app_id, p, filename)
	
	var method = type == 'dir' ? rimraf : fs.unlink
	method(filepath, function (err) {
		if (err) return res.json(resp(err))
		res.json(resp(null, {}))
	})
})

module.exports = router