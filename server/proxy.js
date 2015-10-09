'use strict';

var express = require('express')
var fs = require('fs')
var router = express.Router()
var multipart = require('connect-multiparty')
var mkdirp = require('mkdirp')
var path = require('path')
var tar = require('tar')
var needle = require('needle')

router.get('/remote', function (req, res) {
	needle.get('http://' + decodeURIComponent(req.query.host) + '?path=' + encodeURIComponent(req.query.path), function (err, response) {
		res.send(response.body)
	})
})

module.exports = router