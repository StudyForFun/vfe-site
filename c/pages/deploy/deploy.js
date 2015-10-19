'use strict';

var fdate = require('libs/date')
var Chain = require('libs/chain')
require('comps/upload')
require('comps/selection')
require('comps/copyfile')

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
			deploying: false,
			selectedFiles: [],
			fastDeploySelectedFiles: [],
			deployStatus: '',
			app_name: '',
			app_desc: '',
			copyStatus: '',
			copying: false
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

		this.$comps.fastdeploy = $(this.$el).find('.ui.modal.fastdeploy')
			.modal('setting', 'transition', 'horizontal flip')

		this.$comps.copy = $(this.$el).find('.ui.modal.copy')
			.modal('setting', 'transition', 'horizontal flip')

		this.fetch()
		this.fetchAgents()
		this.fetchPathes()
		this.fetchAppInfo()
	},
	computed: {
		hasSelected: {
			deps: ['files'],
			get: function () {
				return this.$data.files.some(function (item) {
					return item.selected
				})
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
							item.pending = false
							return item
						})
					}
				}.bind(this)
			})
		},
		fetchAppInfo: function () {
			$.ajax({
				url: '/apps/' + this.$data.app_id,
				success: function (data) {
					if (data && data.data) {
						data = data.data
						this.$data = {
							app_name: data.name,
							app_desc: data.desc
						}
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
        getSelectedFiles: function () {
        	return this.$data.files.reduce(function (result, item) {
				if (item.selected) result.push(item)
				return result
			}, [])
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
		onOpenFile: function (e) {
			var file = e.currentTarget.dataset.file
			if (/(\.tar\.gz|\.zip|\.tar)$/i.test(file)) {
				var tarFile
				this.$data.files.some(function (item) {
					if (item.type == 'file' && item.file === file) {
						tarFile = item
						return true
					}
				})
				tarFile.pending = true
				$.ajax({
					url: '/ws/' + this.$data.app_id + '/extract',
					method: 'POST',
					data: {
						path: this.$data.pathes.length ? '/' + this.$data.pathes.join('/') : '',
						filename: file
					},
					success: function (data) {
						setTimeout(function () {
							tarFile.pending = false
							if (data && !data.error) {
								this.fetch()
							}
						}.bind(this), 100)
					}.bind(this)
				})
			} else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
				// TBD
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
		onShowCopy: function () {
			if(!this.getSelectedFiles().length) return

			// init
			this.$data.copyStatus = 'done'

			this.$refs.copyfile.fetch()
			this.$comps.copy.modal('show')
		},
		onHideCopy: function () {
			this.$comps.copy.modal('hide')
		},
		onCopy: function () {
			var files = this.$data.files.reduce(function (result, item) {
				if (item.selected) result.push({
					type: item.type,
					file: item.file
				})
				return result
			}, [])

			if (!files.length) {
				this.$data.copying = false
				return
			}

			this.$data.copying = true
			var dest = this.$refs.copyfile.getCopyUrl()
			var path = this.$data.pathes.length ? '/' + this.$data.pathes.join('/') : './'

			$.ajax({
				url: '/ws/' + this.$data.app_id + '/copy',
				method: 'POST',
				data: {
					path: path,
					files: JSON.stringify(files),
					dest: dest
				},
				success: function (data) {
					this.$data.copying = false
					this.$data.copyStatus = data.data == 'ok' ? 'done' : 'error'
					this.onHideCopy()
					if(data.data == 'ok') {
						alert('拷贝成功')
					} else if(data.data == 'same') {
						alert('拷贝失败: 不支持拷贝到其子目录下~')		
					} else {
						alert('拷贝失败')
					}
				}.bind(this)
			})
		},
		onShowDeploy: function () {
			this.$data.selectedFiles = this.getSelectedFiles()
			this.$comps.deploy.modal('show')
		},
		onHideDeploy: function () {
			this.$comps.deploy.modal('hide')
		},
		onDeploy: function () {

			if (this.$data.deploying) return

			this.$data.deploying = true
			this.$data.deployStatus = ''


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
				success: function (data) {
					this.$data.deploying = false
					this.$data.deployStatus = data == 'ok' ? 'done' : 'error'

				}.bind(this)
			})
		},
		onSaveRule: function (e) {
			var tar = e.currentTarget
			var id = tar.dataset.id
			this.$data.releasePathes.some(function (item, index) {
				if (item._id == id) {
					var valid = this.validateRules(item.rules)
					var status = item.status
					this.$set('releasePathes.' + index + '.status', valid ? 'pending' : 'error')
					if (!valid || status == 'pending') {
						return
					}
					$.ajax({
						url: '/classes/path/' + id + '?_app_id=' + this.$data.app_id,
						method: 'PATCH',
						data: {
							rules: item.rules
						},
						success: function (data) {
							setTimeout(function () {
								this.$set('releasePathes.' + index + '.status', '')
							}.bind(this), 250)
						}.bind(this)
					})
					return true
				}
			}.bind(this))
		},
		onValidateRules: function (e) {
			var tar = e.currentTarget
			var id = tar.dataset.id
			this.$data.releasePathes.some(function (item, index) {
				if (item._id == id) {
					var valid = this.validateRules(item.rules)
					var status = valid ? (item.status == 'pending' ? 'pending' : '') : 'error'
					this.$set('releasePathes.' + index + '.status', status)
					return true
				}
			}.bind(this))
		},
		onShowFastDeploy: function () {
			var that = this

			var selectedFiles = JSON.parse(JSON.stringify(this.getSelectedFiles())).map(function (item) {
				item.matches = []
				item.deploy_status = 'unmatch'
				return item
			})

			var deploys = this.$data.releasePathes.reduce(function (results, path) {

				var deployFiles = []

				var rules = (path.rules || '').trim()
				if (rules){
					rules = that.convertRule2Reg(rules)
					selectedFiles.forEach(function (item) {
						rules.some(function (r) {
							if (r.type == item.type && r.rule.test(item.file)) {
								deployFiles.push(item)
								item.matches.push({
									id: path._id,
									host: path.host,
									path: path.path,
									rules: path.rules,
									status: 'ready'
								})
								item.deploy_status = 'pending'
								return true
							}
						})
					})
				}
				if (deployFiles.length) {
					results.push({
						deployPath: path,
						deployFiles: deployFiles
					})
				}
				return results
			}, [])

			this.$data.fastDeploySelectedFiles = selectedFiles
			this.$comps.fastdeploy.modal('show')

			if (!deploys.length) return

			var chain = Chain()
			chain.each.apply(chain, deploys.map(function (deployData) {
				var files = deployData.deployFiles.map(function (item) {
					return {
						type: item.type,
						file: item.file
					}
				})
				var releasePath = deployData.deployPath
				return function (c) {
					$.ajax({
						url: '/deploy/' + that.$data.app_id,
						method: 'POST',
						data: {
							path: that.$data.pathes.join('/'),
							files: JSON.stringify(files),
							release: releasePath.path,
							host: releasePath.host
						},
						success: function (data) {
							// set status to done
							that.$data.fastDeploySelectedFiles.forEach(function (item) {
								files.some(function (f) {
									if (f.type == item.type && f.file == item.file) {
										if (data !== 'ok') {
											item.matches.forEach(function (m) {
												if (m.id == releasePath._id) {
													m.status = 'error'
												}
											})
										}
										setTimeout(function () {
											item.deploy_status = data == 'ok' ? 'done' : 'error'
										}, 500)
										return true
									}
								})
							})
							c.next()
						}
					})
				}
			}))
			.then()
			.context(this)
			.start()
		},
		onHideFastDeploy: function () {
			this.$comps.fastdeploy.modal('hide')
		},
		onFastDeploy: function () {
			this.onShowFastDeploy()
		},
		convertRule2Reg: function (rules) {
			return rules.trim().split(/\r?\n/).map(function (rs) {
				var type = 'file'
				var rule = rs.trim().replace(/^(dir|file):\s*/, function (m, t) {
					if (t == 'dir') type = 'dir'
					return ''
				})
				return {
					source: rs,
					type: type,
					rule: new RegExp(rule)
				}
			})
		},
		validateRules: function(rules) {
			rules = rules.trim()
			if (!rules) return true
			try {
				this.convertRule2Reg(rules)
				return true
			} catch (e) {
				return false
			}
		}
	}
})