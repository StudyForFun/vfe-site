'use strict';


module.exports = Zect.component('c-appcard', {
	template: require('./app-card.tpl'),
	data: function () {
		return {
			name: '',
			desc: ''
		}
	}
})