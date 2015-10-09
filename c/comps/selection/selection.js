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
		var dd = this.dd = $(this.$el).find('.ui.dropdown').dropdown({
			showOnFocus: false
		})
	},
	methods: {
		refresh: function () {
			this.dd.dropdown('refresh')
		},
		val: function () {
			return this.dd.dropdown('get value')
		},
		setText: function ($value) {
			return $value.host + ':' + $value.port
		},
		setValue: function ($value) {
			return $value.host + ':' + $value.port
		}
	}
})