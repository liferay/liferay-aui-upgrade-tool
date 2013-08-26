(function(){
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var removeAUICSSPrefix = (new (require(path.resolve(__dirname, '../lib/remove-aui-css-prefix.js')).RemoveAUICSSPrefix)());

	var testDataCSS = require('fs').readFileSync(path.resolve(__dirname, '../data/data-remove-aui-css-prefix.css'), 'utf8');

	var testDataJS = require('fs').readFileSync(path.resolve(__dirname, '../data/data-remove-aui-css-prefix.js'), 'utf8');

	var testDataJSP = require('fs').readFileSync(path.resolve(__dirname, '../data/data-remove-aui-css-prefix.jsp'), 'utf8');

	var contentCSS = removeAUICSSPrefix.process(testDataCSS);

	var contentJS = removeAUICSSPrefix.process(testDataJS);

	var contentJSP = removeAUICSSPrefix.process(testDataJSP);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Remove AUI Prefixes",

		'test remove aui- prefix from CSS': function() {
			YUITest.Assert.isTrue(contentCSS.indexOf('.foo {') !== -1, '.aui-foo should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.btn-cancel {') !== -1, '.aui-btn-cancel should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.test123 .foo-bar {') !== -1, '.aui-foo-bar should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.this-should-be-removed {') !== -1, '.aui-this-should-be-removed should be transformed.');
		},

		'test remove aui- prefix from JS': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('var a = { key: \'foo\' };') !== -1, 'aui-foo should be transformed.');

			YUITest.Assert.isTrue(contentJS.indexOf('key: "foo-bar-js"') !== -1, 'aui-foo-bar-js should be transformed.');

			YUITest.Assert.isTrue(contentJS.indexOf('var cssClass = "foo123";') !== -1, 'aui-foo123 should be transformed.');
		},

		'test remove aui- prefix from JSP': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('"disabled helper-hidden" %>') !== -1, '"disabled aui-helper-hidden" %> should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('"disabled helper-not-hidden"') !== -1, '"disabled aui-helper-not-hidden" %> should be transformed.');
		}
	}));
})();