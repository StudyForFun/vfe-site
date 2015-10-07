'use strict';

module.exports = Zect.component('c-upload', {
	template: require('./upload.tpl'),
	data: function () {
		return {
			app_id: '',
			pathes: [],
			lazy: false
		}
	},
	ready: function () {
		var dz = this.dz = new Dropzone(this.$el, {
			url: '/upload/' + this.$data.app_id + '?path=' + this.getPath(),
			uploadMultiple: true,
			clickable: true
		})
		dz.on('success', function () {
			this.onSuccess && this.onSuccess()
		}.bind(this))

		setTimeout(function () {
			this.$data.lazy = true
		}.bind(this))
		this.$watch('pathes', function () {
			dz.options.url = '/upload/' + this.$data.app_id + '?path=' + this.getPath()
		}.bind(this))

	},
	methods: {
		getPath: function () {
			return this.$data.pathes.length
					? this.$data.pathes.join('/')
					: '' 
		},
		clean: function () {
			this.dz.removeAllFiles()
		}
	}
})