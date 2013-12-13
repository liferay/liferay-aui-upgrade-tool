(function() {
	'use strict';

	/*
	 * 1. we rename aui:panel to liferay-ui:panel
	 * 2. We remap the args
	 *	label -> title
	 *	collapsed -> state

		parse the value of collapsed, if contains true -> state's value should be "closed", otherwise "open"
	 */

	var taglibAUIPanel = '</?aui:panel';

	var panelRegex = /(<)(aui:panel)((?:.|[\r\n])*?)(<\/aui:panel>)/g;

	var labelRegex = /(label)([\s\r\n]*)=([\r\s\n]*)("[^"]*")/;

	var collapsedRegex = /(collapsed)([\s\r\n]*=[\r\s\n]*)("[^"]+")/;

	function processArgs(data) {
		data = data.replace(labelRegex, function(match, g1, g2, g3, g4, offset) {
			return 'title' + g2 + g3 + g4;
		});

		data = data.replace(collapsedRegex, function(match, g1, g2, g3, offset) {
			var result = 'state' + g2;

			if (g3 === '"true"') {
				result += '"closed"';
			}
			else if (g3 === '"false"') {
				result += '"open"';
			}
			else {
				result += g3;
			}

			return result;
		});

		return data;
	}

	function ReplaceAUIPanelTaglib(config) {
		this._config = config;
	}

	ReplaceAUIPanelTaglib.prototype = {
		constructor: ReplaceAUIPanelTaglib,

		process: function(content, context) {
			content = content.replace(panelRegex, function(match, g1, g2, g3, g4, offset) {
				var content = g1 + 'liferay-ui:panel' + processArgs(g3) + '<\/liferay-ui:panel>';

				return content;
			});

			return content;
		}
	};

	module.exports.ReplaceAUIPanelTaglib = ReplaceAUIPanelTaglib;
}());