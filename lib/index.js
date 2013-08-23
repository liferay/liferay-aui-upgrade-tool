module.exports.init = function() {
    'use strict';

    var walk = require('walkdir'),
        fs = require('fs-extra'),
        path = require('path'),
        program = require('commander'),

        FILE_TYPE = require(path.resolve(__dirname, '../assets/file-type.js')),

        addDeprecatedSuffixes = (new (require('./add-deprecated-suffixes.js').AddDeprecatedSuffixes)()),
        renameCSSClasses = (new (require('./rename-css-classes.js').RenameCSSClasses)()),
        removeAUICSSPrefix = (new (require('./remove-aui-css-prefix.js').RemoveAUICSSPrefix)()),
        replaceInputCSSClass = (new (require('./replace-input-css-class.js').ReplaceInputCSSClass)()),
        replaceSelectorButton = (new (require('./replace-selector-button.js').ReplaceSelectorButton)()),

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

    function list(value) {
        return value.split(',').map(String);
    }

    program
        .option('-f, --file [file name]', 'The file(s) to process.', list)
        .option('-e, --ext [file extensions]', 'The file extensions which should be processed. Defaults to "js, jsp, css".', function(value) {
            value = value.split(',');

            return value.map(
                function(item) {
                    return item.trim();
                }
            );
        }, ['js', 'jsp', 'jspf', 'css'])
        .version('0.0.1')
        .parse(process.argv);

    if (!program.file) {
        console.log('No files or folder!');

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

        if (extension === 'jspf') {
            extension = 'jsp';
        }

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
                            content = processor.process(content, context);
                        }
                    );

                    //console.log(content);

                    fs.writeFile(fileName, content, function(error) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('It\'s saved!');
                        }
                    });
                }
            );
        }
    }

    // Process passed files/directories
    if (program.file) {
        program.file.forEach(
            function(file) {
                var emitter = walk(file);

                emitter.on('file', function(filename, stat) {
                    var fileExt = getFileExtension(filename);

                    if (program.ext.indexOf(fileExt) >= 0) {
                        console.log('Processing: ' + filename);

                        processFile(filename, fileExt);
                    }
                });
            }
        );
    }
};