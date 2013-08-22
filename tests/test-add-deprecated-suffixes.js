(function(){
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var addDeprecatedSuffixes = (new (require(path.resolve(__dirname, '../lib/add-deprecated-suffixes.js')).AddDeprecatedSuffixes)());

	var testDataJS = require('fs').readFileSync(path.resolve(__dirname, '../data/data-add-deprecated-suffixes.js'), 'utf8');

	var testDataJSP = require('fs').readFileSync(path.resolve(__dirname, '../data/data-add-deprecated-suffixes.jsp'), 'utf8');

	var contentJS = addDeprecatedSuffixes.process(testDataJS);

	var contentJSP = addDeprecatedSuffixes.process(testDataJSP);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Deprecated Suffixes in JS",

		'test adding suffixes via require': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('\'aui-form-deprecated\', \'aui-component\',') !== -1, 'aui-form should be transformed.');

			YUITest.Assert.isTrue(contentJS.indexOf('\'aui-delayed-task-deprecated\', \'aui-set\',') !== -1, 'aui-delayed-task should be transformed.');
		},

		'test adding suffixes via Liferay.provide': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('[\'aui-panel-deprecated\']') !== -1, 'aui-panel should be transformed.');
		}
	}));

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Deprecated Suffixes in JSP",

		'test adding suffixes via aui:script': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('<aui:script use="aui-template-deprecated">') !== -1, 'aui-template should be transformed.');
		},

		'test adding suffixes to more than one module': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('"baui-io-plugin2,aui-io-plugin-deprecated"') !== -1, '"baui-io-plugin2,aui-io-plugin" should be transformed.');
		},
	}));
})();