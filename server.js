'use strict';

var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()

/**
 *  static folder
 **/
app.use(express.static(path.join(__dirname, 'release')))
app.get('/p/:page', function (req, res) {
	res.sendFile(path.join(__dirname, './release/index.html'))
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'text/plain'}))
app.use(require('./server/api'))

/**
 *  server and port
 **/
var port = process.env.PORT || 1024
app.listen(port, function () {
    console.log('Server is listen on port', port)
})