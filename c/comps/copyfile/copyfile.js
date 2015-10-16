'use strict';

module.exports = Zect.component('c-copyfile', {
	template: require('./copyfile.tpl'),
	data: function () {
		return {
			files: [],
			app_id: '',
			pathes: []
		}
	},
	ready: function () {
	},
	methods: {
		fetch: function () {
			/**
			 * fetch files
			 */
			$.ajax({
				url: '/ws/' + this.$data.app_id,
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
						}).map(function (item) {
							item.selected = false
							item.pending = false
							return item
						})
					}
				}.bind(this)
			})
		},
		onRoot: function (e) {
			this.$data.pathes = []
			this.fetch()
		},
		onEnter: function (e) {
			var dir = e.currentTarget.dataset.file
			this.$data.pathes.push(dir)
			this.fetch()
		},
		onPath: function (e) {
			var index = Number(e.currentTarget.dataset.index)
			
			this.$data.pathes = this.$data.pathes.slice(0, index + 1)
			this.fetch()
		},
		getCopyUrl: function () {
			return this.$data.pathes.length ? '/' + this.$data.pathes.join('/') : './'
		}
	}
})