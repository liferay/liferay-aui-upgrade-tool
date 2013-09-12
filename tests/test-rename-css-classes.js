(function() {
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var fs = require('fs');

	var renameCSSClasses = (new (require(path.resolve(__dirname, '../lib/rename-css-classes.js')).RenameCSSClasses)());

	var testDataCSS = fs.readFileSync(path.resolve(__dirname, '../data/data-rename-css-classes.css'), 'utf8');
	var testDataJS = fs.readFileSync(path.resolve(__dirname, '../data/data-rename-css-classes.js'), 'utf8');
	var testDataJSP = fs.readFileSync(path.resolve(__dirname, '../data/data-rename-css-classes.jsp'), 'utf8');

	var contentCSS = renameCSSClasses.process(testDataCSS);
	var contentJS = renameCSSClasses.process(testDataJS);
	var contentJSP = renameCSSClasses.process(testDataJSP);

	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Rename CSS Classes",

		'test rename CSS classes from CSS': function() {
			YUITest.Assert.isTrue(contentCSS.indexOf('.test123 .close-panel {') !== -1, '.test123 .btn-cancel { should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.alert {') !== -1, '.portlet-msg-alert { should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.alert.alert-success .alert.alert-info {') !== -1, '.portlet-msg-success .portlet-msg-info { should be transformed.');
		},

		'test rename CSS classes from JSP': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('<span class="alert alert-error"><%= fi') !== -1, 'portlet-msg-error should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('A.all(\'.alert.alert-success\').hide();') !== -1, 'portlet-msg-success should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('<span class="alert alert-error"><liferay-ui:message') !== -1, '<span class="portlet-msg-error"><liferay-ui:message should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="alert">') !== -1, '<div class="portlet-msg-alert"> should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="hide alert alert-error" id="') !== -1, '<div class="hide portlet-msg-error" id=" should be transformed');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="hide alert alert-success" id="') !== -1, '<div class="hide portlet-msg-success" id=" should be transformed');
		},

		/*
		 *
		 * @test #14
		 */
		'test transofrming aui-helper-hidden': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="node hide"></div>') !== -1, '<div class="node helper-hidden"></div> should be transformed');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="hide node"></div>') !== -1, '<div class="aui-helper-hidden node"></div> should be transformed');
		},

		/*
		 * tests #18
		 */
		'test renaming classes in scriptlets': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('cssClass=\'<%= showConnectedIcon ? "connected" : "connected hide" %>') !== -1, 'cssClass=\'<%= showConnectedIcon ? "connected" : "connected aui-helper-hidden" %>\' should be transformed');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class=\'<%= condition ? someClass : "alert alert-info" %>\'>') !== -1, '<div class=\'<%= condition ? someClass : "alert alert-info" %>\'>  should be transformed');
		},

		/*
		 * @tests #24
		 */
		'test renaming <ul class="nav nav-tabs"': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('<ul class="nav nav-tabs">') !== -1, '<ul class="tabview-list"> should be renamed');
		},

		/*
		 * @tests #30
		 */
		'test renaming mixed classes and scriplets"': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('<span class="left-nav <%= (start == 0) ? "hide" : "previous" %> more-class">') !== -1, 'class="left-nav <%= (start == 0) ? "aui-helper-hidden" : "previous" %> more-class"> should be renamed');

			YUITest.Assert.isTrue(contentJSP.indexOf('<span class="right-nav <%= (total %= end) ? "hide" : "next" %> more-class2">') !== -1, 'class="right-nav <%= (total %= end) ? "aui-helper-hidden" : "next" %> more-class2"> should be renamed');
		},
		
	}));
}());