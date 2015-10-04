'use strict';

require('./index.css')

Zect.create = Zect.extend
Zect.namespace('r')

var Index = require('pages/index')
module.exports = window.boot = function () {
	var $page = new Index()
	$page.$appendTo(document.querySelector('#app'))
}