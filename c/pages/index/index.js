'use strict';

require('comps/search')
require('comps/app-card')

module.exports = Zect.create({
	template: require('./index.tpl'),
	data: function () {
		return {
			apps: [
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'},
				{name: 'BigBang', desc: 'Mobile Web App.'}
			]
		}
	},
	methods: {
		grid: function (list, rows) {
			var list = list.slice()
			var grid = []
			while(list.length) {
				grid.push(list.splice(0, rows || 3))
			}
			return grid
		}
	}
})