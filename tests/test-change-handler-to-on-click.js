(function() {
    'use strict';

    var YUITest = require('yuitest');

    var path = require('path');

    var fs = require('fs');

    var changeHandlerOnClick = (new (require(path.resolve(__dirname, '../lib/change-handler-to-on-click.js')).ChangeHandlerOnClick)());

    var testDataJS = fs.readFileSync(path.resolve(__dirname, '../data/data-change-handler-to-on-click.js'), 'utf8');

    var contentJS = changeHandlerOnClick.process(testDataJS);

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Test Rename Handler to onClick in Toolbar",

        'test rename handler to onClick': function() {
            var dest,
                src;

            src =
                '        label: \'button1\',\n' +
                '        handler: function(event1) {\n' +
                '            someFunction1();\n' +
                '        },\n' +
                '        test123: \'this is a test\'';


            dest =
                '        label: \'button1\',\n' +
                '        on: {\n' +
                '        click: function(event1) {\n' +
                '            someFunction1();\n' +
                '        }},\n' +
                '        test123: \'this is a test\'';


            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');

            src =
                '        label: \'button1\',\n' +
                '        handler: function(event1) {\n' +
                '            someFunction1();\n' +
                '        }\n' +
                '    }';


            dest =
                '        label: \'button1\',\n' +
                '        on: {\n' +
                '        click: function(event1) {\n' +
                '            someFunction1();\n' +
                '        }},';


            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');

            src =
                '        label: \'button3\',\n' +
                '        handler: function(event3) {\n' +
                '            someFunction3();\n' +
                '        }\n' +
                '    }\n' +
                '];';

            dest =
                '        label: \'button3\',\n' +
                '        on: {\n' +
                '        click: function(event3) {\n' +
                '            someFunction3();\n' +
                '        }}\n' +
                '    }\n' +
                '];';

            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');

            src =
                '        label: \'button4\',\n' +
                '        handler: function(event4) {\n' +
                '            function alabala() {\n' +
                '                function nica() {\n' +
                '                }\n' +
                '            }\n' +
                '        },\n' +
                '        fun';

             YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        }
    }));
}());