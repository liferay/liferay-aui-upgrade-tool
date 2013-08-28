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

        'test rename handler: push, plus one property': function() {
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
        },

        'test rename handler: push, no properties': function() {
            var dest,
                src;

            src =
                '    {\n' +
                '        icon: \'add2\',\n' +
                '        label: \'button2\',\n' +
                '        handler: function(event2) {\n' +
                '            someFunction2();\n' +
                '        }\n' +
                '    }';


            dest =
                '    {\n' +
                '        icon: \'add2\',\n' +
                '        label: \'button2\',\n' +
                '        on: {\n' +
                '        click: function(event2) {\n' +
                '            someFunction2();\n' +
                '        }}\n' +
                '    }';


            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        },

        'test rename handler: equals, no properties': function() {
            var dest,
                src;

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
        },

        'test rename handler: equals, nested functions': function() {
            var dest,
                src;

            src =
                '        label: \'button4\',\n' +
                '        handler: function(event4) {\n' +
                '            function alabala() {\n' +
                '                function nica() {\n' +
                '                }\n' +
                '            }\n' +
                '        },\n' +
                '        fun';

            dest =
                '        label: \'button4\',\n' +
                '        on: {\n' +
                '        click: function(event4) {\n' +
                '            function alabala() {\n' +
                '                function nica() {\n' +
                '                }\n' +
                '            }\n' +
                '        }},\n' +
                '        fun';

            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        },

        /*
         * Tests #17
         */
        'test rename handler: used as property value': function() {
            var dest,
                src;

            src =
                '        children: [\n' +
                '            {\n' +
                '                handler: function(event) {\n' +
                '                    instance._editEntry(contact);\n' +
                '                },\n' +
                '                icon: \'edit\',\n' +
                '                label: \'label\'\n' +
                '            }\n' +
                '        ]';

            dest =
                '        children: [\n' +
                '            {\n' +
                '                on: {\n' +
                '                click: function(event) {\n' +
                '                    instance._editEntry(contact);\n' +
                '                }},\n' +
                '                icon: \'edit\',\n' +
                '                label: \'label\'\n' +
                '            }\n' +
                '        ]';

            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        },

        /*
         * Tests #20
         */
        'test rename handler when there are multiple properties': function() {
            var dest,
                src;

            src =
                '        children: [\n' +
                '            {\n' +
                '                // This handler will be changed to on click\n' +
                '                handler: function(event) {\n' +
                '                    instance._editEntry(contact);\n' +
                '                },\n' +
                '                icon: \'edit\'\n' +
                '            },\n' +
                '            {\n' +
                '                // This handler will no more be left alone\n' +
                '                handler: function(event) {\n' +
                '                    instance._deleteEntry(contact);\n' +
                '                },\n' +
                '                icon: \'delete\'\n' +
                '            }\n' +
                '        ]';

            dest =
                '        children: [\n' +
                '            {\n' +
                '                // This handler will be changed to on click\n' +
                '                on: {\n' +
                '                click: function(event) {\n' +
                '                    instance._editEntry(contact);\n' +
                '                }},\n' +
                '                icon: \'edit\'\n' +
                '            },\n' +
                '            {\n' +
                '                // This handler will no more be left alone\n' +
                '                on: {\n' +
                '                click: function(event) {\n' +
                '                    instance._deleteEntry(contact);\n' +
                '                }},\n' +
                '                icon: \'delete\'\n' +
                '            }\n' +
                '        ]';

            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        }
    }));
}());