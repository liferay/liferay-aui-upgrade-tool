(function() {
	'use strict';

	var path = require('path');

	var FILE_TYPE = require(path.resolve(__dirname, '../assets/file-type.js'));

	function RenameCSSClasses(config) {
		this._config = config;
	}

	RenameCSSClasses.CLASSES = require('../assets/css-classes.json').CLASSES;

	RenameCSSClasses.prototype = {
		constructor: RenameCSSClasses,

		process: function(content, context) {
			RenameCSSClasses.PATTERNS.forEach(
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

	RenameCSSClasses.prepareRegExpReplace = function(className, prefix) {
		if (prefix) {
			className = className.split(' ');

			className = className.map(
				function(item) {
					return prefix + item;
				}
			);

			className = className.join('');
		}

		var regExp = new RegExp('(?:^|[\'" ])(' + className + ')(?:$|[\'" ])');

		return regExp;
	};

	RenameCSSClasses.replaceCSSClass = function(match, params) {
		var i,
			key,
			keys = Object.keys(RenameCSSClasses.CLASSES),
			regExp,
			originalMatch = match;

		for (i = 0; i < keys.length; ++i) {
			key = keys[i];

			regExp = RenameCSSClasses.prepareRegExpReplace(key, params ? params.prefix : null);

			match = match.replace(regExp, RenameCSSClasses.CLASSES[key]);

			if (originalMatch !== match) {
				break;
			}
		}

		return match;
	};

	RenameCSSClasses.PATTERNS = [
		{
			desc: '.portlet-msg-alert',
			match: /(\.)([\w-]+)/g,
			replace: function(match, g1, g2) {
				return g1 + RenameCSSClasses.replaceCSSClass(g2, {
					prefix: '.'
				});
			}
		},
		{
			desc: 'class=""',
			match: /((?:class|className|cssClass|iconClass)=["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + RenameCSSClasses.replaceCSSClass(g2) + g3;
			}
		},
		{
			desc: 'key: "aui-foo"',
			match: /([^'"]\w+[^'"A-Z]\s*\:\s*["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + RenameCSSClasses.replaceCSSClass(g2) + g3;
			}
		},
		{
			desc: 'variable = "aui-foo"',
			match: /([^'"]\w+[^'"]\s\=\s["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + RenameCSSClasses.replaceCSSClass(g2) + g3;
			}
		},
		{
			desc: 'add/removeClass',
			match: /(Class\(\s*["']\s*)([\w\s-]+)(\s*["'])/g,
			replace: function(match, g1, g2, g3) {
				return g1 + RenameCSSClasses.replaceCSSClass(g2) + g3;
			}
		}
	];

	module.exports.RenameCSSClasses = RenameCSSClasses;
}());