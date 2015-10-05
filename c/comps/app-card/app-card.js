'use strict';

var fdate = require('libs/date')

module.exports = Zect.component('c-appcard', {
	template: require('./app-card.tpl'),
	data: function () {
		return {
			id: '',
			name: '',
			desc: '',
			time: 0
		}
	},
	methods: {
		fdate: function (t, tpl) {
			return fdate(t, tpl)
		}
	}
})