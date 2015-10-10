'use strict';

var fdate = require('libs/date')
require('comps/upload')
require('comps/selection')

module.exports = Zect.create({
	template: require('./deploy.tpl'),
	data: function () {
		return {
			files: [],
			pathes: [],
			agents: [],
			releasePathes: [],
			path: '',
			path_desc: '',
			dir_name: '',
			deploying: false
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

		this.$comps.addPath = $(this.$el).find('.ui.modal.addpath')
			.modal('setting', 'transition', 'vertical flip')

		this.$comps.pathesMan = $(this.$el).find('.ui.modal.pathesman')
			.modal('setting', 'transition', 'vertical flip')

		this.$comps.deploy = $(this.$el).find('.ui.modal.deploy')
			.modal('setting', 'transition', 'horizontal flip')

		this.fetch()
		this.fetchAgents()
		this.fetchPathes()
	},
	computed: {
		hasSelected: {
			deps: ['files'],
			get: function () {
				return this.$data.files.some(function (item) {
					return item.selected
				})
			}
		},
		selectedFiles: {
			deps: ['files'],
			get: function () {
				return this.$data.files.reduce(function (result, item) {
					if (item.selected) result.push(item)
					return result
				}, [])
			}
		}
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
							return item
						})
					}
				}.bind(this)
			})
		},
		fetchPathes: function () {
			$.get('/classes/path?_app_id=' + this.$data.app_id, function (data) {
				if (!data.error) {
					this.$data.releasePathes = data.data
				}
			}.bind(this))
		},
		fetchAgents: function () {
			$.get('/classes/agent?_app_id=_global', function (data) {
				if (!data.error) {
					this.$data.agents = data.data
				}
			}.bind(this))
		},
		onSync: function () {
			this.fetch()
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
		setSelectionText: function (value) {
        	return value.host + '' + value.path
        },
        setSelectionValue: function (value) {
            return value._id
        },
		onRoot: function () {
			this.$data.pathes = []
			this.fetch()
		},
		onEnter: function (e) {
			var file = e.currentTarget.dataset.file
			var type = e.currentTarget.dataset.type

			if (type === 'file') {
				if (/(\.tar\.gz|\.zip)$/.test(file.toLowerCase())) {

				} else if (/\.(jpg|jpeg|png|gif|webp)$/.test(file.toLowerCase())) {

				} else {
					
				}
			} else {
				this.$data.pathes.push(file)
				this.fetch()
			}
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
					filename: this.$data.dir_name,
					type: 'dir'
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
		},
		onDeleteFile: function (e) {
			var tar = e.currentTarget
			var filename = tar.dataset.file
			var type = tar.dataset.type

			switch (type) {
				case 'dir':
					if (!window.confirm('确认删除目录: ' + filename + ' ?')) return
					break
				case 'file':
					if (!window.confirm('确认删除文件: ' + filename + ' ?')) return
					break
			}

			$.ajax({
				url: '/ws/' + this.$data.app_id,
				method: 'DELETE',
				data: {
					path: this.$data.pathes.join('/'),
					filename: filename,
					type: type
				},
				success: function () {
					this.fetch()
				}.bind(this)
			})
		},
		onShowAddPath: function () {
			this.$comps.addPath.modal('show')
		},
		onHideAddPath: function () {
			this.$comps.addPath.modal('hide')
		},
		onAddPath: function () {
			if (!this.$data.path) return

			$.ajax({
				url: '/classes/path?_app_id=' + this.$data.app_id,
				method: 'POST',
				data: {
					host: this.$refs.agentSelection.val(),
					path: this.$data.path,
					desc: this.$data.path_desc
				},
				success: function (data) {
					this.$data.releasePathes.push(data.data)
					this.$comps.addPath.modal('hide')
				}.bind(this)
			})
		},
		onShowPathes: function () {
			this.$comps.pathesMan.modal('show')
		},
		onDeletePath: function (e) {
			var id = e.currentTarget.dataset.id
			$.ajax({
				url: '/classes/path/' + id + '?_app_id=' + this.$data.app_id,
				method: 'DELETE',
				data: {},
				success: function () {
					this.fetchPathes()
				}.bind(this)
			})
		},
		onSelectAll: function () {
			var selected = false
			if (this.$data.files.some(function (item) {
				return !item.selected
			})) {
				selected = true
			}
			this.$data.files.forEach(function (item) {
				item.selected = selected
			})
			;[].slice.call(this.$el.querySelectorAll('.filecheckbox input')).forEach(function (e) {
				e.checked = selected
			})
		},
		onSelect: function (e) {
			var index = e.currentTarget.dataset.index
			this.$data.files[index].selected = !this.$data.files[index].selected
		},
		onDeleteFiles: function () {
			if (!window.confirm('是否删除所选中文件？')) return

			var count = 0
			var hasDeleted = false
			function done() {
				count --
				hasDeleted && !count && this.fetch()
			}

			this.$data.files.forEach(function (file) {
				if (!file.selected) return
				hasDeleted = true
				count ++

				$.ajax({
					url: '/ws/' + this.$data.app_id,
					method: 'DELETE',
					data: {
						path: this.$data.pathes.join('/'),
						filename: file.file,
						type: file.type
					},
					success: done.bind(this)
				})
			}.bind(this))
		},
		onShowDeploy: function () {
			this.$comps.deploy.modal('show')
		},
		onHideDeploy: function () {
			this.$comps.deploy.modal('hide')
		},
		onDeploy: function () {

			if (this.$data.deploying) return

			this.$data.deploying = true

			var id = this.$refs.deploySelection.val()
			var releasePath

			this.$data.releasePathes.some(function (item) {
				if (item._id == id) {
					releasePath = item
					return true
				}
			})
			if (!releasePath) return

			var files = this.$data.files.reduce(function (result, item) {
				if (item.selected) result.push({
					type: item.type,
					file: item.file
				})
				return result
			}, [])

			if (!files.length) {
				this.$data.deploying = false
				return
			}
			$.ajax({
				url: '/deploy/' + this.$data.app_id,
				method: 'POST',
				data: {
					path: this.$data.pathes.join('/'),
					files: JSON.stringify(files),
					release: releasePath.path,
					host: releasePath.host
				},
				success: function () {
					this.$data.deploying = false
				}.bind(this)
			})
		}
	}
})