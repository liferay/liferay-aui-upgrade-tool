(function(){
	'use strict';

	var YUITest = require('yuitest');

	var suite = new YUITest.TestSuite('Test Add Deprecated Suffixes');

	var addDeprecatedSuffixes = (new (require('../lib/add-deprecated-suffixes.js').AddDeprecatedSuffixes)());

	suite.add(new YUITest.TestCase({
		'test '
	}));

	YUITest.TestRunner.add(suite);
})();