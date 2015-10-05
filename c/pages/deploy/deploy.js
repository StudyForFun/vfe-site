'use strict';

var fdate = require('libs/date')

module.exports = Zect.create({
	template: require('./deploy.tpl'),
	data: function () {
		return {
			files: [],
			pathes: []
		}
	},
	created: function () {
		this.$data.app_id = location.pathname.match(/^\/p\/deploy\/([^\\]+)/)[1]
	},
	ready: function () {
		this.fetch()
	},
	methods: {
		fetch: function () {
			$.ajax({
				url: ['/ws', this.$data.app_id].join('/'),
				data: {
					path: encodeURIComponent(this.$data.pathes.length ? '/' + this.$data.pathes.join('/') : '')
				},
				method: 'GET',
				success: function (data) {
					if (data && !data.error) {
						this.$data.files = data.data.sort(function (a, b) {
							var atype = a.type == 'dir' ? 1 : 0 
							var btype = b.type == 'dir' ? 1 : 0 
							if (atype > btype) return -1
							else if (atype < btype) return 1
							else {
								if (a.update_time > b.update_time) return -1
								else if (a.update_time < b.update_time) return 1
								else return 0
							}
						})
					}
				}.bind(this)
			})
		},
		fdate: fdate,
		onRoot: function () {
			this.$data.pathes = []
			this.fetch()
		},
		onEnter: function (e) {
			var file = e.currentTarget.dataset.file
			var type = e.currentTarget.dataset.type

			if (type !== 'dir') return
			this.$data.pathes.push(file)
			this.fetch()
		},
		onPath: function (e) {
			var index = Number(e.currentTarget.dataset.index)
			
			this.$data.pathes = this.$data.pathes.slice(0, index + 1)
			this.fetch()
		}
	}
})