'use strict';


module.exports = Zect.create({
	template: require('./port.tpl'),
	data: function () {
		return {
			port: '',
			name: '',
			desc: '',
			link: '',
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
							return item
						})
					}
				}.bind(this)
			})
		},
		onAdd: function () {
			var port
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
					link: link || ''
				},
				success: function (data) {
					this.$data.pending = false
					this.$data = {
						port: '',
						name: '',
						desc: '',
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
						desc: desc,
						name: name,
						link: link,
						port: port
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