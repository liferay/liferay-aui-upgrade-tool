(function(){
	'use strict';

	var YUITest = require('yuitest');

	var addDeprecatedSuffixes = (new (require('../lib/remove-css-prefixes.js').AddDeprecatedSuffixes)());

	var testDataJS = require('fs').readFileSync('../data/data-remove-css-prefixes.js', 'utf8');

	var testDataCSS = require('fs').readFileSync('../data/data-remove-css-prefixes.css', 'utf8');

	var contentJS = addDeprecatedSuffixes.process(testDataJS);

	var contentCSS = addDeprecatedSuffixes.process(testDataCSS);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Remove AUI Prefixes",

		'test remove aui- prefix from CSS': function() {
			YUITest.Assert.isTrue(contentCSS.indexOf('.foo {') !== -1, '.aui-foo should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.btn-cancel {') !== -1, '.aui-btn-cancel should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.test123 .aui-foo-bar {') !== -1, '.aui-foo-bar should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.aui-this-should-be-removed {') !== -1, '.aui-this-should-be-removed should be transformed.');
		},

		'test remove aui- prefix from JS': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('var a = { key: \'foo\' };') !== -1, 'aui-foo should be transformed.');

			YUITest.Assert.isTrue(contentJS.indexOf('key: "foo-bar-js"') !== -1, 'aui-foo-bar-js should be transformed.');

			YUITest.Assert.isTrue(contentJS.indexOf('var cssClass = "foo123";') !== -1, 'aui-foo123 should be transformed.');
		}
	}));

	YUITest.TestRunner.run();
})();