module.exports.init = function() {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var program = require('commander');

    var FILE_TYPE = require(path.resolve(__dirname, '../assets/file-type.js'));

    var addDeprecatedSuffixes = (new (require('./add-deprecated-suffixes.js').AddDeprecatedSuffixes)());
    var renameCSSClasses = (new (require('./rename-css-classes.js').RenameCSSClasses)());
    var removeAUICSSPrefix = (new (require('./remove-aui-css-prefix.js').RemoveAUICSSPrefix)());
    var replaceInputCSSClass = (new (require('./replace-input-css-class.js').ReplaceInputCSSClass)());
    var replaceSelectorButton = (new (require('./replace-selector-button.js').ReplaceSelectorButton)());

    var PROCESSORS = {
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
      .option('-d, --dir [directory name]', 'The directory to process.')
      .option('-e, --ext [file extensions]', 'The file extensions which should be processed. Defaults to "js, jsp, css".', ['js', 'jsp', 'css'])
      .version('0.0.1')
      .parse(process.argv);

    if (!program.file && !program.dir) {
        console.log('No files or folder specified!');

        process.exit();
    }

    function getContext(extension) {
        debugger;

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
                function(err, content) {
                    if (err) {
                        console.log('Cannot read file: ' + fileName + '.\n' + err);

                        return;
                    }

                    content = content.toString();

                    processors.forEach(
                        function(processor) {
                            var result = processor.process(content, context);

                            //console.log(result);

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

        program.file.forEach(
            function(file) {
                var fileExt = getFileExtension(file);

                if (program.ext.indexOf(fileExt) >= 0) {
                    processFile(file, fileExt);
                }
            }
        );
    }

    // Process passed directory
    if (program.dir) {
        console.log('Parsing directory: ' + program.dir);

        var finder = require('findit').find(program.dir);

        finder.on(
            'file',
            function (file, stat) {
                var fileExt = getFileExtension(file);

                if (program.ext.indexOf(getFileExtension(file)) >= 0) {
                    processFile(file, fileExt);
                }
            }
        );
    }
};