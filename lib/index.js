module.exports.init = function() {
    'use strict';

    var fs = require('fs');
    var program = require('commander');

    var CONSTANTS = require('constants');

    var addDeprecatedSuffixes = (new (require('./add-deprecated-suffixes.js').AddDeprecatedSuffixes)());
    var renameCSSClasses = (new (require('./rename-css-classes.js').RenameCSSClasses)());
    var removeDeprecatedPrefixes = (new (require('./remove-css-prefixes.js').RemoveDeprecatedPrefixes)());
    var replaceInputCSSClass = (new (require('./replace-input-css-class.js').ReplaceInputCSSClass)());
    var replaceSelectorButton = (new (require('./replace-selector-button.js').ReplaceSelectorButton)());

    var PROCESSORS = {
        css: [
            removeDeprecatedPrefixes,
            renameCSSClasses
        ],
        js: [
            removeDeprecatedPrefixes,
            addDeprecatedSuffixes,
            renameCSSClasses,
            replaceSelectorButton
        ],
        jsp: [
            removeDeprecatedPrefixes,
            addDeprecatedSuffixes,
            renameCSSClasses,
            replaceSelectorButton,
            replaceInputCSSClass
        ]
    };

    function list(value) {
        return value.split(',').map(String);
    }

    program
      .option('-f, --file [file name]', 'The file(s) to process.', list)
      .option('-d, --dir [directory name]', 'The directory to process.')
      .option('-e, --ext [file extensions]', 'The file extensions which should be processed. Defaults to "js, jsp, css".', ['js', 'jsp', 'css'])
      .version('0.0.1')
      .parse(process.argv);

    if (!program.file && !program.dir) {
        console.log('No files or folder specified!');

        process.exit();
    }

    function getContext(extension) {
        var fileType = CONSTANTS.FILE_TYPE;

        extension = extension.toLowerCase();

        if (extension === 'css') {
            return fileType.CSS;
        }
        else if (extension === 'js') {
            return fileType.CSS;
        }
        else if (extension === 'jsp') {
            return fileType.JSP;
        }
        else {
            return fileType.UNKNOWN;
        }
    }

    function processFile(fileName, extension) {
        var context,
            processors;

        context = getContext(extension);
        processors = PROCESSORS[extension];

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
                            var result = processor.process(content, context);

                            console.log(result);

                            // TODO: write result
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