(function() {
    'use strict';

    var YUITest = require('yuitest');

    var path = require('path');

    var replaceInputPanelTaglib = (new (require(path.resolve(__dirname, '../lib/replace-input-panel-taglib.js')).ReplaceAUIPanelTaglib)());

    var testData = require('fs').readFileSync(path.resolve(__dirname, '../data/data-replace-input-panel-taglib.jsp'), 'utf8');

    var content = replaceInputPanelTaglib.process(testData);

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: 'Test rename input panel taglib',

        'test rename input panel taglib': function() {
            YUITest.Assert.isTrue(content.indexOf('<liferay-ui:panel label="Start1" state="true" id="step1">\n</liferay-ui:panel>') !== -1, 'Liferay panel with id step1 should be converted');

            YUITest.Assert.isTrue(content.indexOf('<liferay-ui:panel label="Start2" state="false" id="step2">\n</liferay-ui:panel>') !== -1, 'Liferay panel with id step2 should be converted');
        }
    }));
}());
