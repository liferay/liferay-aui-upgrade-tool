(function() {
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var handleDeprecatedModules = (new (require(path.resolve(__dirname, '../lib/handle-deprecated-modules.js')).HandleDeprecatedModules)());

	var testDataJS = require('fs').readFileSync(path.resolve(__dirname, '../data/data-handle-deprecated-modules.js'), 'utf8');

	var testDataJSP = require('fs').readFileSync(path.resolve(__dirname, '../data/data-handle-deprecated-modules.jsp'), 'utf8');

	var contentJS = handleDeprecatedModules.process(testDataJS);

	var contentJSP = handleDeprecatedModules.process(testDataJSP);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Deprecated Suffixes in JS",

		'test adding suffixes via require': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('\'aui-form-deprecated\', \'aui-component\',') !== -1, 'aui-form should be transformed.');

			YUITest.Assert.isTrue(contentJS.indexOf('\'aui-delayed-task-deprecated\', \'aui-set\',') !== -1, 'aui-delayed-task should be transformed.');
		},

		'test adding suffixes via Liferay.provide': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('[\'aui-panel-deprecated\', \'') !== -1, 'aui-panel should be transformed.');
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

		'test adding suffixes in case of position="inline"': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('<aui:script position="inline" use="aui-io-plugin-deprecated,aui-io-deprecated,baui-io-plugin">') !== -1, '<aui:script position="inline" use="aui-io-plugin,aui-io,baui-io-plugin"> should be transformed.');
		}
	}));

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Removing modules in JS",

		'test replacing removed modues in require': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('\'aui-component\', \'liferay-util-window\', \'aui-event-input\'') !== -1, '\'aui-component\', \'aui-dialog\', \'aui-event-input\' should be transformed.');
		},

		'test replacing removed modules in provide': function() {
			YUITest.Assert.isTrue(contentJS.indexOf('[\'aui-panel-deprecated\', \'liferay-util-window\']') !== -1, '[\'aui-panel\', \'aui-dialog\'] should be transformed.');
		},

		'test replacing removed modules in use': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('aui-io-deprecated,liferay-util-window,baui-io-plugin') !== -1, 'aui-io,aui-dialog,baui-io-plugin should be transformed.');
		}
	}));
}());