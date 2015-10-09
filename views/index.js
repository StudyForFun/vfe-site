'use strict';

require('./index.css')
require('./lib/dropzone.css')

Zect.create = Zect.extend
Zect.namespace('r')

var pages = {
	index: require('pages/index'),
	deploy: require('pages/deploy'),
	remote: require('pages/remote')
}
module.exports = window.boot = function () {
	var route = location.pathname.match(/^\/p\/(\w+)/)
	var pg = route ? route[1] : 'index'
	var Ctor = pages[pg] || pages['index']
	
	var $page = new Ctor()
	$page.$appendTo(document.querySelector('#app'))
}