'use strict';

var express = require('express')
var fs = require('fs')
var router = express.Router()
var multipart = require('connect-multiparty')
var mkdirp = require('mkdirp')
var path = require('path')
var tmpDir = path.join(__dirname, '../tmp')
var wsDir = path.join(__dirname, '../.workspace')
var unzip = require('unzip')
var tar = require('tar')

mkdirp.sync(tmpDir)
router.post('/upload/:app_id', multipart({
	autoFiles: true,
	uploadDir: tmpDir
}), function (req, res) {
	var dir = decodeURIComponent(req.query.path || './')
	dir = path.join(wsDir, req.params.app_id, dir)

	mkdirp(dir, function (err) {
		req.files.file.forEach(function (file) {
			fs.renameSync(file.path, path.join(dir, file.name))
		})
		res.send('ok')
	})

})

router.post('/dupload/:app_id', multipart({
	autoFiles: true,
	uploadDir: tmpDir
}), function (req, res) {
	var dir = decodeURIComponent(req.query.path || './')
	dir = path.join(wsDir, req.params.app_id, dir)

	mkdirp(dir, function (err) {
		req.files.file.forEach(function (file) {
			var npath = path.join(dir, file.name)
			fs.renameSync(file.path, npath)
			fs.createReadStream(npath).pipe(tar.Extract({
				path: dir
			})).on('close', function () {
				fs.unlink(npath, function () {
					res.send('ok')
				})
			})
		})
	})

})


module.exports = router