module.exports.init = function() {
    'use strict';

    var fs = require('fs');
    var program = require('commander');

    var addDeprecatedSuffixes = (new (require('./add-deprecated-suffixes.js').AddDeprecatedSuffixes)());

    var cssClassRename = (new (require('./rename-css-classes.js').CSSClassRename)());

    var selectorButton = (new (require('./selector-button.js').SelectorButton)());

    var PROCESSORS = {
        css: [
            (new (require('./remove-css-prefixes.js').CSSPrefixRemover)()),
            cssClassRename
        ],
        js: [
            addDeprecatedSuffixes,
            cssClassRename,
            selectorButton
        ],
        jsp: [
            addDeprecatedSuffixes,
            cssClassRename,
            selectorButton
        ]
    };

    function list(value) {
        return value.split(',').map(String);
    }

    program
      .option('-f, --file [file name]', 'The file(s) to process.', list)
      .option('-d, --dir [directory name]', 'The directory to process.')
      .option('-o, --out [file name]', 'The ouput file in which the information about found modules should be stored', 'modules.json')
      .option('-e, --ext [file extensions]', 'The file extensions which should be processed. Defaults to "js, jsp, css".', ['js', 'jsp', 'css'])
      .version('0.0.1')
      .parse(process.argv);

    if (!program.file && !program.dir) {
        console.log('No files or folder specified!');

        process.exit();
    }

    function processFile(fileName, extension) {
        var processors = PROCESSORS[extension];

        if (processors) {
            fs.readFile(
                fileName,
                function(err, content) {
                    if (err) {
                        console.log('Cannot read file: ' + fileName + '.\n' + err);

                        return;
                    }

                    content = content.toString();

                    processors.forEach(
                        function(processor) {
                            var result = processor.process(content);

                            debugger;
                            console.log(result);

                            // TODO: result can be object with the following properties:
                            // content
                            // warnings
                            // errors
                        }
                    )
                }
            );
        }
    }

    // Process passed files
    if (program.file) {
        console.log('Parsing files: ' + program.file);

        program.file.forEach(extractFileModules);
    }

    // Process passed directory
    if (program.dir) {
        console.log('Parsing directory: ' + program.dir);

        var finder = require('findit').find(program.dir);

        finder.on(
            'file',
            function (file, stat) {
                var fileExt = file.substr(file.lastIndexOf('.') + 1);

                if (program.ext.indexOf(fileExt.toLowerCase()) >= 0) {
                    processFile(file, fileExt);
                }
            }
        );
    }
};