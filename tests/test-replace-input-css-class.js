(function() {
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var replaceInputCSSClass = (new (require(path.resolve(__dirname, '../lib/replace-input-css-class.js')).ReplaceInputCSSClass)());

	var testData = require('fs').readFileSync(path.resolve(__dirname, '../data/data-replace-input-css-class.jsp'), 'utf8');

	var content = replaceInputCSSClass.process(testData);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Convert inputCSSClass to cssClass",

		'test convert inputCSSClass': function() {
			YUITest.Assert.isTrue(content.indexOf('cssClass="alabala calendar-portlet-invite-resources-input1"') !== -1, 'inputCSSClass on new lines should be transformed.');

			YUITest.Assert.isTrue(content.indexOf(' cssClass="alabala calendar-portlet-invite-resources-input2"') !== -1, 'inputCSSClass on same line should be transformed.');

			YUITest.Assert.isTrue(content.indexOf(' cssClass="alabala calendar-portlet-invite-resources-input2"') !== -1, 'inputCSSClass as second attribute on same line should be transformed.');

			YUITest.Assert.isTrue(content.indexOf('cssClass="test">') !== -1, 'inputCSSClass as single attrbiute should be transformed.');
		}
	}));
}());