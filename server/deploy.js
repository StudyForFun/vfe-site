'use strict';

var express = require('express')
var fs = require('fs')
var mkdirp = require('mkdirp')
var tar = require('tar')
var zlib = require('zlib')
var router = express.Router()
var path = require('path')
var tmpDir = path.join(__dirname, '../tmp')
var wsDir = path.join(__dirname, '../../.workspace')
var archiver = require('archiver')
var needle = require('needle')
var uuid = require('node-uuid')
var multipart = require('connect-multiparty')

function UUID(){
	return uuid.v4()
}

mkdirp.sync(tmpDir)
router.post('/deploy/:app_id', function (req, res) {

	var archive = archiver.create('tar', {
		mode: 755
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

router.post('/deploy/:app_id/cli', multipart({
	autoFiles: true,
	uploadDir: tmpDir
}), function (req, res) {
	var file = req.files.file[0]
	var releaseHost = decodeURIComponent(req.query.host)
	var releaseDir = decodeURIComponent(req.query.path)
	var autoDeploy = req.query.auto && req.query.auto !== 'false'
	var uploadPath = req.query.upload_path || './'
	var timeout = req.query.timeout ? Number(req.query.timeout) : 10*1000
	var retries = req.query.retries ? Number(req.query.retries) : 5
	var fp = file.path

	function deploy() {
		needle.post('http://' + releaseHost + '/?path=' + encodeURIComponent(releaseDir), {
			'file[0]': {
				file: fp,
				content_type: 'application/x-gzip'
			}
		}, { multipart: true, open_timeout: timeout }, function (err, r, data) {
			if ((err || data.error) && retries --) return deploy()

			fs.unlink(fp, function () {
				if (err) return res.send(err)
				else if (data.error) return res.send('deploy error !')
				res.send('ok')
			})
		})
	}
	if (autoDeploy) {
		// retry when match error
		deploy()
	} else {
		var dir = path.join(wsDir, req.params.app_id, uploadPath)
		var callbacked
		fs.createReadStream(fp)
			.pipe(zlib.createGunzip())
			.pipe(tar.Extract({
				path: dir
			}))
			.on('close', function () {
				fs.unlink(fp, function () {
					if (callbacked) return
					callbacked = true
					res.send('ok')
				})
			})
			.on('error', function (error) {
				if (callbacked) return
				callbacked = true
				res.send(error || 'error')
			})
	}

})

module.exports = router