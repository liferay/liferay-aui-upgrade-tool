(function() {
	'use strict';

	function CSSProcessor(config) {
		this._config = config;
	}

	CSSProcessor.prototype = {
		process: function(content) {
			CSSProcessor.REMOVE_PATTERNS.forEach(
				function(removePattern) {
					content = content.replace(
						removePattern.match, removePattern.replace || '');
				}
			);

			return content;
		}
	};

	//  (?:^|['" ])(portlet-msg-error)(?:$|['" ])

	CSSProcessor.PATTERNS = [
		{
			desc: '.aui-',
			match: /\.([\w-]+)/g,
			replace: '.'
		},
		{
			desc: 'class=""',
			match: /((?:class|className|cssClass|iconClass)=["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		},
		{
			desc: 'key: "aui-foo"',
			match: /([^'"]\w+[^'"A-Z]\s*\:\s*["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		},
		{
			desc: 'variable = "aui-foo"',
			match: /([^'"]\w+[^'"]\s\=\s["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		},
		{
			desc: 'add/removeClass',
			match: /(Class\(\s*["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		}
	];

	module.exports.CSSProcessor = CSSProcessor;
}());