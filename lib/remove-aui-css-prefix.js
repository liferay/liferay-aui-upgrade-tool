(function() {
	'use strict';

	function RemoveAUICSSPrefix(config) {
		this._config = config;
	}

	RemoveAUICSSPrefix.prototype = {
		constructor: RemoveAUICSSPrefix,

		process: function(content, context) {
			RemoveAUICSSPrefix.REMOVE_PATTERNS.forEach(
				function(pattern) {
					// apply the pattern only if context is not specified or it is the same as the current one
					if (!pattern.context || pattern.context === context) {
						content = content.replace(
							pattern.match, pattern.replace || '');
					}
				}
			);

			return content;
		}
	};

	RemoveAUICSSPrefix.REMOVE_PATTERNS = [
		{
			desc: '.aui-',
			match: /\.aui\-/g,
			replace: '.'
		},
		{
			desc: 'class=""',
			match: /((?:class|className|cssClass|iconClass)[\s\r\n]*=[\s\r\n\\]*["']\s*)([\w\s-]+)([\s\\]*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + g2.replace(/aui\-/g, '') + g3;
			}
		},
		{
			desc: 'cssClass=\'<%= showConnectedRequestedIcon ? "disabled" : "disabled aui-helper-hidden" %>\'',
			match: /((?:class|className|cssClass|iconClass)[\s\r\n]*=[\s\r\n]*(['"]*)<%=)([^<>%]*)(%>\2)/g,
			replace: function(match, g1, g2, g3, g4) {
				return g1 + g3.replace(/aui\-/g, '') + g4;
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

	module.exports.RemoveAUICSSPrefix = RemoveAUICSSPrefix;
}())