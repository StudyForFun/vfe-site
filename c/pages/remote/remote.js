'use strict';

var fdate = require('libs/date')
var util = require('modules/util')

module.exports = Zect.create({
	template: require('./remote.tpl'),
	data: function () {
		return {
			files: [],
			pathes: [],
			remote_host: '',
			remote_path: ''
		}
	},
	created: function () {
		var qs = util.queryParse(location.search)
		this.$data.remote_host = decodeURIComponent(qs.host)
		this.$data.remote_path = decodeURIComponent(qs.path)
		this.$data.app_id = qs.app_id
	},
	ready: function () {
		this.fetch()
	},
	methods: {
		fetch: function () {
			/**
			 * fetch files
			 */
			$.ajax({
				url: '/remote',
				data: {
					host: encodeURIComponent(this.$data.remote_host),
					path: encodeURIComponent(this.$data.remote_path + '/' + this.$data.pathes.join('/'))
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
							return item
						})
					}
				}.bind(this)
			})
		},
		fdate: fdate,
		fsize: function (size) {
			if (size < 1024) {
				return  '<span style="color: yellowgreen">' + size + ' Byte</span>'
			} else if (size < 1024*1024){
				return '<span style="color: yellowgreen">' + Math.round(size/1024) + ' KB</span>'
			} else {
				return '<span style="color: yellowgreen">' + Math.round(size/1024/1024) + ' MB</span>'
			}
		},
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
		},
		onBack: function () {
			location.href = '/p/deploy/' + this.$data.app_id
		}
	}
})