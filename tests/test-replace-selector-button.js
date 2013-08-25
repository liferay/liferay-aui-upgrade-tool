(function() {
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var replaceSelectorButton = (new (require(path.resolve(__dirname, '../lib/replace-selector-button.js')).ReplaceSelectorButton)());

	var testData = require('fs').readFileSync(path.resolve(__dirname, '../data/data-replace-selector-button.js'), 'utf8');

	var content = replaceSelectorButton.process(testData);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Replace Selector Button",

		'test convert inputCSSClass': function() {
			YUITest.Assert.isTrue(content.indexOf('testDelegate()},\n    \'.selector-button\'') !== -1, '.selector-button input on new lines should be transformed.');

			YUITest.Assert.isTrue(content.indexOf('test123,\n    \'.selector-button\'') !== -1, '.selector-button input with function declaration should be transformed.');

			YUITest.Assert.isTrue(content.indexOf('test123, \'.selector-button\'') !== -1, '.selector-button input on same line should be transformed.');

			YUITest.Assert.isTrue(content.indexOf('teston();},\n    \'.selector-button\'\n);;;') !== -1, '.selector-button in on listener should be transformed.');
		}
	}));
}());