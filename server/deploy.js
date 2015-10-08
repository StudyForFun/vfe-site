'use strict';

var express = require('express')
var fs = require('fs')
var mkdirp = require('mkdirp')
var router = express.Router()
var path = require('path')
var tmpDir = path.join(__dirname, '../tmp')
var wsDir = path.join(__dirname, '../.workspace')
var archiver = require('archiver')
var needle = require('needle')
var uuid = require('node-uuid')

function UUID(){
	return uuid.v4()
}

mkdirp.sync(tmpDir)
router.post('/deploy/:app_id', function (req, res) {

	var archive = archiver.create('zip', {})
	var files = JSON.parse(req.body.files)
	var dir = decodeURIComponent(req.body.path || './')
	dir = path.join(wsDir, req.params.app_id, dir)

	files.forEach(function (f) {
		if (f.type == 'dir') {
			archive.directory(path.join(dir, f.file), f.file)
		} else {
			console.log(path.join(dir, f.file))
			archive.file(path.join(dir, f.file))
		}
	})

	var fp = path.join(tmpDir, UUID() + '.zip')
	archive.pipe(fs.createWriteStream(fp))
		.on('finish', function () {
				needle.post('/upload/test', {
  					'file[0]': {
						file: fp,
  						content_type: 'application/zip'
  					}
				}, { multipart: true })
				.on('end', function () {
					res.send('ok')
				})
		})
	archive.finalize()

})

module.exports = router