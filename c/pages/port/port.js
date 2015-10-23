'use strict';


module.exports = Zect.create({
	template: require('./port.tpl'),
	data: function () {
		return {
			port: '',
			name: '',
			desc: '',
			link: '',
			users: '',
			ports: [],
			editing: false,
			pending: false
		}
	},
	ready: function () {
		this.fetch()
	},
	methods: {
		fetch: function () {
			$.ajax({
				url: '/classes/port',
				method: 'GET',
				data: {
					_app_id: '_global'
				},
				success: function (data) {
					if (data.data) {
						this.$data.ports = data.data.sort(function (a, b) {
							if (a.port > b.port) return 1
							else if (a.port < b.port) return -1
							else return 0
						}).map(function (item) {
							item.status = ''
							item.users = item.users || ''
							return item
						})
					}
				}.bind(this)
			})
		},
		formatUsers: function (users) {
			if (!users) return ''
			return users.split(/\s*[,，]\s*/).map(function (item) {
				return '<i class="icon linux teal"></i>' +  item
			}).join(' ')
		},
		formatChangeLine: function (text) {
			return text.replace(/\r?\n/g, '<br />')
		},
		onAdd: function () {
			var port = 8001
			this.$data.ports.some(function (item) {
				if (port && port != item.port) return true
				else {
					port = Number(item.port) + 1
				}
			})
			this.$data.port = port
			this.$data.editing = true
			setTimeout(function () {
				$(this.$el).find('input.name-inp').focus()
			}.bind(this))
		},
		onCancel: function () {
			this.$data.editing = false
		},
		onSubmit: function () {
			if (this.$data.pending) return

			var port = this.$data.port
			var name = this.$data.name
			var desc = this.$data.desc
			var link = this.$data.link
			var users = this.$data.users
			var matched
			if (!/^\d+$/.test(port)) {
				return alert('端口不合法，请重新输入')
			} else if (this.$data.ports.some(function (item) {
				matched = item
				return item.port == port
			})) {
				if (!confirm('端口 ' + matched.port + ' 已被“' + matched.name + '“占有，确认提交？')) return
			} else if (!name) {
				return alert('请输入程序名称')
			}

			this.$data.pending = true
			$.ajax({
				url: '/classes/port?_app_id=_global',
				method: 'POST',
				data: {
					port: port,
					name: name || '',
					desc: desc || '',
					users: users || '',
					link: link || ''
				},
				success: function (data) {
					this.$data.pending = false
					this.$data = {
						port: '',
						name: '',
						desc: '',
						users: '',
						link: ''
					}
					this.$data.editing = false
					this.fetch()
				}.bind(this)
			})
		},
		onDelete: function (item) {
			if (confirm('是否删除 ' + item.port + ':' + (item.name || '') )) {
				$.ajax({
					url: '/classes/port/' + item._id + '?_app_id=_global',
					method: 'DELETE',
					success: function (data) {
						if (data.error) {
							alert('删除失败' + data.error)
						} else {
							this.fetch()
						}
					}.bind(this)
				})
			}
		},
		onEdit: function (id) {
			var target
			this.$data.ports.some(function (item) {
				if (item._id === id) {
					target = item
					// item.status = 'edit'
					return true
				}
			})

			if (target.status != 'edit') {
				target.status = 'edit'
			} else {
				// submit
				var port = target.port
				var name = target.name
				var desc = target.desc
				var link = target.link
				var users = target.users
				var matched

				if (!/^\d+$/.test(port)) {
					return alert('端口不合法，请重新输入')
				} else if (this.$data.ports.some(function (item) {
					if (item.port == port && item._id !== target._id) {
						matched = item
						return true
					}
				})) {
					if (!confirm('端口 ' + matched.port + ' 已被“' + matched.name + '“占有，确认提交？')) return
				} else if (!name) {
					return alert('请输入程序名称')
				}

				$.ajax({
					url: '/classes/port/' + target._id + '?_app_id=_global',
					method: 'PATCH',
					data: {
						port: port,
						name: name,
						desc: desc || '',
						link: link || '',
						users: users || ''
					},
					success: function (data) {
						if (data.error) {
							alert('修改失败' + data.error)
						} else {
							target.status = ''
						}
					}.bind(this)
				})
			}
		}
	}
})