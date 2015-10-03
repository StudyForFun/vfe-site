'use strict';

var express = require('express')
var path = require('path')
var app = express()

/**
 *  static folder
 **/
app.use(express.static(path.join(__dirname, 'release')))

/**
 *  server and port
 **/
var port = process.env.PORT || 1024
app.listen(port, function () {
    console.log('Server is listen on port', port)
})