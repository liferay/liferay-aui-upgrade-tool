(function(){
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var addDeprecatedSuffixes = (new (require(path.resolve(__dirname, '../lib/add-deprecated-suffixes.js')).AddDeprecatedSuffixes)());

	var testData = require('fs').readFileSync(path.resolve(__dirname, '../data/data-add-deprecated-suffixes.js'), 'utf8');

	var content = addDeprecatedSuffixes.process(testData);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Deprecated Suffixes",

		'test adding suffixes via require': function() {
			YUITest.Assert.isTrue(content.indexOf('requires: [\'aui-base-deprecated\', \'aui-component\',') !== -1, 'aui-base should be transformed.');

			YUITest.Assert.isTrue(content.indexOf('\'aui-delayed-task-deprecated\', \'aui-set\',') !== -1, 'aui-delayed-task should be transformed.');
		},

		'test adding suffixes via Liferay.provide': function() {
			YUITest.Assert.isTrue(content.indexOf('[\'aui-panel-deprecated\']') !== -1, 'aui-panel should be transformed.');
		},

		'test adding suffixes via aui:script': function() {
			YUITest.Assert.isTrue(content.indexOf('<aui:script use="aui-template-deprecated">') !== -1, 'aui-template should be transformed.');
		}
	}));
})();