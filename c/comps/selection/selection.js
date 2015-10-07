'use strict';

module.exports = Zect.component('c-selection', {
	template: require('./selection.tpl'),
	data: function () {
		return {
			name: '',
			agents: [],
			selected: ''
		}
	},
	ready: function () {
		var dd = this.dd = $(this.$el).find('.ui.dropdown').dropdown()
	},
	methods: {
		refresh: function () {
			this.dd.dropdown('refresh')
		},
		val: function () {
			return this.dd.dropdown('get value')
		}
	}
})