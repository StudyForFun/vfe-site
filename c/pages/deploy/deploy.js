'use strict';

var fdate = require('libs/date')
require('comps/upload')

module.exports = Zect.create({
	template: require('./deploy.tpl'),
	data: function () {
		return {
			files: [],
			pathes: [],
			dir_name: ''
		}
	},
	created: function () {
		this.$data.app_id = location.pathname.match(/^\/p\/deploy\/([^\\]+)/)[1]
	},
	ready: function () {
		this.$comps = {}
		this.$comps.createDir = $(this.$el).find('.ui.modal.createdir')
			.modal('setting', 'transition', 'horizontal flip')

		this.$comps.upload = $(this.$el).find('.ui.modal.upload')
			.modal('setting', 'transition', 'horizontal flip')
			.modal({
				onHide: function () {
					this.onHideUpload()
				}.bind(this)
			})

		this.fetch()
	},
	methods: {
		fetch: function () {
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
						})
					}
				}.bind(this)
			})
		},
		fdate: fdate,
		fsize: function (size) {
			if (size < 1024) {
				return  '<span style="color: #777">' + size + ' Byte</span>'
			} else if (size < 1024*1024){
				return '<span style="color: yellowgreen">' + Math.round(size/1024) + ' KB</span>'
			} else {
				return '<span style="color: blue">' + Math.round(size/1024/1024) + ' MB</span>'
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
		onShowCreate: function () {
			this.$comps.createDir.modal('show')
		},
		onHideCreate: function () {
			this.$comps.createDir.modal('hide')
		},
		onCreate: function () {
			if (!this.$data.dir_name) return

			$.ajax({
				url: '/ws/' + this.$data.app_id,
				method: 'POST',
				data: {
					path: this.$data.pathes.join('/'),
					filename: this.$data.dir_name
				},
				success: function (data) {
					this.fetch()
					this.$comps.createDir.modal('hide')
				}.bind(this)
			})
		},
		onShowUpload: function () {
			this.$comps.upload.modal('show')
		},
		onUploadDone: function () {
			this.fetch()
		},
		onHideUpload: function () {
			this.$refs.upload.clean()
		},
		onHome: function () {
			location.href = '/'
		}
	}
})