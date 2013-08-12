(function() {
	'use strict';

	function CSSPrefixRemover(config) {
		this._config = config;
	}

	CSSPrefixRemover.prototype = {
		process: function(content) {
			CSSPrefixRemover.REMOVE_PATTERNS.forEach(
				function(removePattern) {
					content = content.replace(
						removePattern.match, removePattern.replace || '');
				}
			);

			return content;
		}
	};

	CSSPrefixRemover.REMOVE_PATTERNS = [
		{
			desc: '.aui-',
			match: /\.aui\-/g,
			replace: '.'
		},
		{
			desc: 'class=""',
			match: /((?:class|className|cssClass|iconClass)=["']\s*)([\w\s-]+)(\s*["'])/g,
			// match: /((?:class|className)=["']\s*)(aui\-[\s\w-]+)+(\s*["'])/g, // good
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		},
		{
			desc: 'key: "aui-foo"',
			match: /([^'"]\w+[^'"A-Z]\s*\:\s*["']\s*)(aui\-[\s\w-]+)+(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		},
		{
			desc: 'variable = "aui-foo"',
			match: /([^'"]\w+[^'"]\s\=\s["']\s*)(aui\-[\s\w-]+)+(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		},
		{
			desc: 'add/removeClass',
			match: /(Class\(\s*["']\s*)(aui\-[\s\w-]+)+(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		}
	];

	module.exports.CSSPrefixRemover = CSSPrefixRemover;
}());