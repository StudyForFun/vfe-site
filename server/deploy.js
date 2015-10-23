'use strict';

var express = require('express')
var fs = require('fs')
var mkdirp = require('mkdirp')
var router = express.Router()
var path = require('path')
var tmpDir = path.join(__dirname, '../tmp')
var wsDir = path.join(__dirname, '../../.workspace')
var archiver = require('archiver')
var needle = require('needle')
var uuid = require('node-uuid')

function UUID(){
	return uuid.v4()
}

mkdirp.sync(tmpDir)
router.post('/deploy/:app_id', function (req, res) {

	var archive = archiver.create('tar', {
		mode: 511
	})
	var files = JSON.parse(req.body.files)
	var dir = decodeURIComponent(req.body.path || './')
	var releaseDir = decodeURIComponent(req.body.release || '')
	var releaseHost = req.body.host
	dir = path.join(wsDir, req.params.app_id, dir)

	files.forEach(function (f) {
		if (f.type == 'dir') {
			archive.directory(path.join(dir, f.file), f.file)
		} else {
			archive.file(path.join(dir, f.file), {name: f.file})
		}
	})

	var fp = path.join(tmpDir, UUID() + '.tar')

	console.log('Release to', 'http://' + releaseHost + '/?path=' + releaseDir)
	archive.pipe(fs.createWriteStream(fp))
		.on('finish', function () {
				needle.post('http://' + releaseHost + '/?path=' + encodeURIComponent(releaseDir), {
  					'file[0]': {
						file: fp,
  						content_type: 'application/tar'
  					}
				}, { multipart: true, open_timeout: 30000}, function (err) {
					if (err) return res.send(err)
					fs.unlink(fp, function () {
						res.send('ok')
					})
				})
		})
	archive.finalize()

})

module.exports = router