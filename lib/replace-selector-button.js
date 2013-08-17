(function() {
	'use strict';

	var REGEX = /(\.(?:delegate|on)[\s\r\n]*\([\s\S]*?['"])(\.selector-button input)(['"][\s\r\n]*\);?)/g;

	function ReplaceSelectorButton(config) {
		this._config = config;
	}

	ReplaceSelectorButton.prototype = {
		constructor: ReplaceSelectorButton,

		process: function(content, context) {
			return content.replace(REGEX, function(match, g1, g2, g3) {
				return g1 + '.selector-button' + g3;
			});
		}
	};

	module.exports.ReplaceSelectorButton = ReplaceSelectorButton;
}());