(function() {
	'use strict';

	var inputCssRegex = /<aui:input[\s\r\n]*[^>]+inputCssClass="([^"]+)"[^>]*/g;

	var cssRegex = /[\s|^]cssClass="([^"]+)"/;

	var inputCssRegexAttribute = /[\s|^]inputCssClass="([^"]+)"/;

	function InputCSSClass(config) {
		this._config = config;
	}

	InputCSSClass.prototype = {
		constructor: InputCSSClass,

		process: function(content) {
			return content.replace(inputCssRegex, function(match, g1, offset) {
				var result = match;

				console.log(match);

				var cssClassResult = cssRegex.exec(match);

				if (cssClassResult) {
					result = result.replace(cssClassResult[0], ' cssClass="' + cssClassResult[1] + ' ' + g1 + '"');

					result = result.replace(inputCssRegexAttribute, '');
				}
				else {
					result = result.replace('inputCssClass', 'cssClass');
				}

				return result;
			});
		}
	};

	module.exports.InputCSSClass = InputCSSClass;
}());