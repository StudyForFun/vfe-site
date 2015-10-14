'use strict';

var express = require('express')
var fs = require('fs')
var router = express.Router()
var multipart = require('connect-multiparty')
var mkdirp = require('mkdirp')
var path = require('path')
var tmpDir = path.join(__dirname, '../tmp')
var wsDir = path.join(__dirname, '../../.workspace')
var tar = require('tar')
var async = require('async')

mkdirp.sync(tmpDir)

function resp(err, data, code) {
	if (err) return {error: err, code: code || 500}
	else return {data: data, code: code || 200}
}
function rename(oldpath, newpath, cb) {
	var readStream = fs.createReadStream(oldpath)
	var writeStream = fs.createWriteStream(newpath)
	readStream.pipe(writeStream) 
	    .on('close', function () {
	        fs.unlink(oldpath, cb)
	    })
	    .on('error', function (err) {
	    	cb(err)
	    })
}

router.post('/upload/:app_id', multipart({
	autoFiles: true,
	uploadDir: tmpDir
}), function (req, res) {
	var dir = decodeURIComponent(req.query.path || './')
	dir = path.join(wsDir, req.params.app_id, dir)

	mkdirp(dir, function (err) {
		if (err) return res.json(resp(err))
		var hasError
		async.each(req.files.file, function (file, cb) {
			rename(file.path, path.join(dir, file.name), function (error) {
				hasError = error
				cb(error)
			})
		}, function (results) {
			if (hasError) return res.json(resp(hasError))
			res.json(resp(null, 'ok'))
		})
	})

})

module.exports = router