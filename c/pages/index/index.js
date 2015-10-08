'use strict';

require('comps/search')
require('comps/app-card')
require('comps/selection')

module.exports = Zect.create({
	template: require('./index.tpl'),
	data: function () {
		return {
			apps: [],
			create_name: '',
			create_desc: '',
			agents: [],
			agent_host: '',
			agent_port: '',
			path: '',
			path_desc: ''
		}
	},
	ready: function () {
		this.$comps = {}
		this.$comps.createApp = $(this.$el).find('.ui.modal.createapp')
			.modal('setting', 'transition', 'horizontal flip')

		this.$comps.addAgent = $(this.$el).find('.ui.modal.addagent')
			.modal('setting', 'transition', 'vertical flip')

		this.$comps.addPath = $(this.$el).find('.ui.modal.addpath')
			.modal('setting', 'transition', 'browse')

		this.fetch()
		this.fetchAgents()
	},
	methods: {
		fetch: function () {
			$.get('/apps', function (data) {
				if (!data.error) {
					this.$data.apps = data.data
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
		},
		onShowAddAgent: function () {
			this.$comps.addAgent.modal('show')
		},
		onHideAddAgent: function () {
			this.$comps.addAgent.modal('hide')
		},
		onAddAgent: function () {
			console.log(this.$data.agent_host, this.$data.agent_port)
			if (!this.$data.agent_host || !this.$data.agent_port) return

			$.ajax({
				url: '/classes/agent?_app_id=_global',
				method: 'POST',
				data: {
					host: this.$data.agent_host,
					port: this.$data.agent_port
				},
				success: function (data) {
					this.$data.agents.push(data.data)
					this.$comps.addAgent.modal('hide')
					this.$refs.agentSelection.refresh()
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
				url: '/classes/path?_app_id=_global',
				method: 'POST',
				data: {
					host: this.$refs.agentSelection.val(),
					path: this.$data.path
				},
				success: function () {
					this.$comps.addPath.modal('hide')
				}.bind(this)
			})
		}
	}
})