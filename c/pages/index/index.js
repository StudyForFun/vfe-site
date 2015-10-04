'use strict';

require('comps/search')
require('comps/app-card')

module.exports = Zect.create({
	template: require('./index.tpl'),
	data: function () {
		return {
			apps: [],
			create_name: '',
			create_desc: ''
		}
	},
	ready: function () {
		this.$comps = {}
		this.$comps.createApp = $(this.$el).find('.ui.modal')
			.modal('setting', 'transition', 'horizontal flip')

		this.fetch()
	},
	methods: {
		fetch: function () {
			$.get('/apps', function (data) {
				if (!data.error) {
					this.$data.apps = data.data
				}
			}.bind(this))
		},
		grid: function (list, rows) {
			var list = list.slice()
			var grid = []
			while(list.length) {
				grid.push(list.splice(0, rows || 3))
			}
			return grid
		},
		onShowCreate: function () {
			this.$comps.createApp.modal('show')
		},
		onHideCreate: function () {
			this.$comps.createApp.modal('hide')
		},
		onCreate: function () {
			if (!this.$data.create_name || !this.$data.create_desc) return

			$.ajax({
				url: '/apps',
				method: 'POST',
				data:{
					name: this.$data.create_name,
					desc: this.$data.create_desc
				},
				success: function (data, status, xhr) {
					this.$comps.createApp.modal('hide')
					this.fetch()
				}.bind(this)
			})
		}
	}
})