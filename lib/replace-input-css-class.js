(function() {
	'use strict';

	var inputCSSRegex = /<aui:input[\s\r\n]*[^>]+inputCssClass="([^"]+)"[^>]*/g;

	var cssRegex = /[\s|^]cssClass="([^"]+)"/;

	var inputCSSRegexAttribute = /[\s|^]inputCssClass="([^"]+)"/;

	function ReplaceInputCSSClass(config) {
		this._config = config;
	}

	ReplaceInputCSSClass.prototype = {
		constructor: ReplaceInputCSSClass,

		process: function(content, context) {
			return content.replace(inputCSSRegex, function(match, g1, offset) {
				var result = match;

				var cssClassResult = cssRegex.exec(match);

				if (cssClassResult) {
					result = result.replace(cssClassResult[0], ' cssClass="' + cssClassResult[1] + ' ' + g1 + '"');

					result = result.replace(inputCSSRegexAttribute, '');
				}
				else {
					result = result.replace('inputCssClass', 'cssClass');
				}

				return result;
			});
		}
	};

	module.exports.ReplaceInputCSSClass = ReplaceInputCSSClass;
}());