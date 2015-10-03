'use strict';

var RaisedButton = require('material-ui/lib/raised-button')
var TextField = require('material-ui/lib/text-field')
var FontIcon = require('material-ui/lib/font-icon')
var Paper = require('material-ui/lib/paper')

module.exports = React.createClass({
	getDefaultProps: function () {
		return {
		}
	},
	render: function () {
		return (
			<div className="p-index">
				<i className="material-icons">face</i>
				<FontIcon className="material-icons">home</FontIcon>
				<TextField className="searchInput"
					hintText="Search" 
					fullWidth={true} />
				<div className="apps">
					<Paper zDepth={2} className="app"></Paper>
				</div>
	  		</div>
  		)
	}
})