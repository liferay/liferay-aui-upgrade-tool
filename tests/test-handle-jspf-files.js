(function() {
    'use strict';

    var fs = require('fs-extra');
    var YUITest = require('yuitest');

    var path = require('path');

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Test handle JSPF files",

        'test if we handle JSPF files': function() {
            var exec,
                file;

            file = path.resolve(__dirname, new Date().getTime() + '.jspf');

            fs.writeFileSync(file, 'A.all(\'.tabview-list\').hide();');

            exec = require('child_process').exec;

            exec('node bin/laut.js -f ' + file,
                function(error, stdout, stderr) {
                    var content = fs.readFileSync(file, 'utf8');

                    fs.removeSync(file);

                    this.resume(function() {
                        YUITest.Assert.isTrue(content.indexOf('A.all(\'.nav.nav-tabs\').hide();') !== -1, 'tabview-list should be transformed.');
                    });
                }.bind(this),
                {
                    cwd: path.resolve(__dirname, '..')
                }
            );

            this.wait();
        }
    }));
}());
