module.exports.init = function() {
    'use strict';

    var fs = require('fs-extra'),
        glob = require('glob'),
        path = require('path'),
        program = require('commander'),

        FILE_TYPE = require(path.resolve(__dirname, '../assets/file-type.js')),

        addDeprecatedSuffixes = (new (require('./add-deprecated-suffixes.js').AddDeprecatedSuffixes)()),
        removeAUICSSPrefix = (new (require('./remove-aui-css-prefix.js').RemoveAUICSSPrefix)()),
        renameCSSClasses = (new (require('./rename-css-classes.js').RenameCSSClasses)()),
        replaceInputCSSClass = (new (require('./replace-input-css-class.js').ReplaceInputCSSClass)()),
        replaceSelectorButton = (new (require('./replace-selector-button.js').ReplaceSelectorButton)()),

        filePatterns,

        PROCESSORS = {
            css: [
                removeAUICSSPrefix,
                renameCSSClasses
            ],
            js: [
                removeAUICSSPrefix,
                addDeprecatedSuffixes,
                renameCSSClasses,
                replaceSelectorButton
            ],
            jsp: [
                removeAUICSSPrefix,
                addDeprecatedSuffixes,
                renameCSSClasses,
                replaceSelectorButton,
                replaceInputCSSClass
            ]
        };

    program        
        .option('-f, --file [file name]', 'The file(s) to process.', function(value) {
            return '{' + value + '}';
        })
        .option('-e, --ext [file extensions]', 'The file extensions which should be processed. Defaults to "js, jsp, css".', function(value) {
            value = value.split(',');

            return value.map(
                function(item) {
                    return item.trim();
                }
            );
        }, ['js', 'jsp', 'css'])
        .version('0.0.1')
        .parse(process.argv);

    if (!program.file) {
        console.log('No file patterns specified!');

        process.exit();
    }

    function getContext(extension) {
        extension = extension.toLowerCase();

        if (extension === 'css') {
            return FILE_TYPE.CSS;
        }
        else if (extension === 'js') {
            return FILE_TYPE.CSS;
        }
        else if (extension === 'jsp') {
            return FILE_TYPE.JSP;
        }
        else {
            return FILE_TYPE.UNKNOWN;
        }
    }

    function getFileExtension(fileName) {
         var fileExt = fileName.substr(fileName.lastIndexOf('.') + 1);

        return fileExt ? fileExt.toLowerCase() : '';
    }

    function processFile(fileName, extension) {
        var context,
            processors;

        context = getContext(extension);
        processors = PROCESSORS[extension];

        if (processors) {
            fs.readFile(
                fileName,
                function(error, content) {
                    if (error) {
                        console.log('Cannot read file: ' + fileName + '.\n' + err);

                        return;
                    }

                    content = content.toString();

                    processors.forEach(function(processor) {
                        content = processor.process(content, context);
                    });

                    console.log(content);

                    // TODO: write result
                }
            );
        }
    }

    glob(program.file, null, function(error, files) {
        if (error) {
            console.log('Error: ' + err);
        }
        else {
            files.forEach(function(file) {
                debugger;
                var fileExt = getFileExtension(file);

                if (program.ext.indexOf(fileExt) >= 0) {
                    processFile(file, fileExt);
                }
            });
        }
    });
};