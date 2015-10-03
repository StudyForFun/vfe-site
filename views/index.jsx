'use strict';

require('./index.css')

var React = window.React = require('react') // export to global
var Index = require('pages/index')

window.boot = function () {
	React.render(<Index />, document.querySelector('#app'))
}