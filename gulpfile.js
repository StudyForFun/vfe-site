'use strict';

var gulp = require('gulp')
var path = require('path')
var vfe = require('vfe')
var watch = require('gulp-watch')
var inject = require('gulp-inject')
var meta = require('./package.json')

/**
 * Build configures
 */
var COMPONENT_MODULES = 'c'
var release_dir = './release'
var config = {
	html: 'views/index.html',
	source: ['views/**', COMPONENT_MODULES + '/**'],
	js_cdn: 'http://host/path/to/js',
}


/**
 * @cli vfe --> start: "default"
 * @cli vfe start --> start: "default", "watch"
 * @cli vfe release --> start: "release"
 */
gulp.task('default', ['clean'], build({ minify: false }))
gulp.task('release', ['clean'], build({ prefix: config.js_cdn }))
gulp.task('clean', function () {
	return gulp.src(release_dir, { read: false }).pipe(vfe.clean())
})
gulp.task('watch', function () {
	return watch(config.source, vfe.util.once(function (next) {
		gulp.start('default', function (err) {
			next()
		})
	}))
})


/**
 * Components build handler
 */
function build (options) {
	return function () {
		return 	vfe.merge(
				gulp.src(config.html)
					.pipe(inject(
						vfe.merge(
							gulp.src(options.libs || ['./views/lib/*.js'])
								.pipe(vfe.concat(meta.name + '-lib.js', {newLine: ';'}))
								.pipe(vfe.hash({
						            hashLength: 6,
						            template: '<%= name %>_<%= hash %><%= ext %>'
						        }))
								.pipe(vfe.if(options.minify, vfe.uglify()))
								.pipe(gulp.dest(release_dir)),

							vfe({
								minify: options.minify,
								name: meta.name || 'bundle',
								entry: './views/index',
								libs: [],
								modulesDirectories: [COMPONENT_MODULES, 'node_modules'],
								loaders: [{
							    	test: /\.jsx$/,
							     	loader: 'babel'
							    }, {
							    	test: /\.dom$/,
							     	loader: 'babel'
							    }],
							    onRequest: function (f) {
							    	if (/node_modules/.test(f.context)) return false
							    }
							})
							.pipe(gulp.dest(release_dir))
							.pipe(vfe.filter(function (file) {
								return  options.minify 
												? /\.min\.js$/.test(file.path) 
												: !/\.min\.js$/.test(file.path)
							}))
						),
						{
							transform: function (filepath) {
								/**
								 * Javascript release prefix
								 */
								var uri = (options.prefix || '/') + path.basename(filepath)
								if (/\.css$/.test(uri)) {
									return '<link rel="stylesheet" href="%s" />'.replace('%s', uri)
								} else {
									return '<script type="text/javascript" src="%s"></script>'.replace('%s', uri)
								}
							}
						}
					))
					.pipe(gulp.dest(release_dir)),

				gulp.src(['./views/asserts/**/*'])
					.pipe(gulp.dest(path.join(release_dir, 'asserts')))
				)
				.on('end', function () {
					// It will be trigger start callback
					gulp.stop(null, true)
				})
	}
}