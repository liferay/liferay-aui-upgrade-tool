(function() {
	'use strict';

	var REGEX = /(\.(?:delegate|on)[\s\r\r]*\([\s\S]*['"])(\.selector-button input)(['"][\s\r\n]*\)(?:;?|$))/g;

	function SelectorButton(config) {
		this._config = config;
	}

	SelectorButton.prototype = {
		constructor: SelectorButton,

		process: function(content) {
			return content.replace(REGEX, function(match, g1, g2, g3) {
				debugger;
				return g1 + '.selector-button' + g3;
			});
		}
	};

	module.exports.SelectorButton = SelectorButton;
}());