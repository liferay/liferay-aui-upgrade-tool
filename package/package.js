(function() {
    'use strict';

    var fs = require('fs-extra'),
        http = require('http-get'),
        path = require('path'),
        program = require('commander'),
        spawn = require('child_process').spawn,
        targz = require('tar.gz'),
        laut = require(path.resolve(__dirname, '../lib')),

        files = require(path.resolve(__dirname, 'export.json')).FILES,

        outputDir,
        uri = {
            gnu32: 'http://nodejs.org/dist/v{version}/node-v{version}-linux-x86.tar.gz',
            gnu64: 'http://nodejs.org/dist/v{version}/node-v{version}-linux-x64.tar.gz',
            osx32: 'http://nodejs.org/dist/v{version}/node-v{version}-darwin-x86.tar.gz',
            osx64: 'http://nodejs.org/dist/v{version}/node-v{version}-darwin-x64.tar.gz',
            win32: 'http://nodejs.org/dist/v{version}/node.exe',
            win64: 'http://nodejs.org/dist/v{version}/x64/node.exe'
        },
        version = laut.version;

    program
        .option('-n, --nodejs [nodejs version]', 'The version of NodeJS to wrap [0.8.21] by default', '0.8.21')
        .option('-d, --dist [destination folder]', 'The dist folder in which package should be created [dist] by default', path.resolve(__dirname, '../dist'))
        .option('-p, --platform [build platform]', 'The platform, on which NodeJS should run ["win32", "win64", "osx32", "osx64", "gnu32", "gnu64"]', function(value) {
            value = value.split(',');

            return value.map(
                function(item) {
                    return item.trim();
                }
            );
        }, ['win32', 'win64', 'osx32', 'osx64', 'gnu32', 'gnu64'])
        .version(version)
        .parse(process.argv);

    // create temp directory
    outputDir = path.normalize(__dirname + path.sep + 'temp');

    fs.removeSync(outputDir);
    fs.mkdirsSync(outputDir);

    function cleanup() {
        fs.removeSync(outputDir);
    }

    function copyFile(src, dest, callback) {
        var isDir = fs.statSync(src).isDirectory();

        if (isDir) {
            fs.mkdirsSync(dest);
        }

        fs.copy(src, dest, callback);
    }

    function copyExecutableFile(dirToWrap, platform, callback) {
        var executableFile;

        executableFile = isWindows(platform) ? 'run.bat' : 'run.sh';

        copyFile(path.resolve(__dirname, executableFile), dirToWrap + path.sep + executableFile, callback);
    }

    function copyRequiredFiles(dirToWrapData, callback) {
        var copyFiles = files.slice(0);

        copyFiles.forEach(
            function(file) {
                var dest,
                    src;

                dest = path.normalize(dirToWrapData + path.sep + file);
                src = path.resolve(__dirname, '../', file);

                copyFile(src, dest, function(error) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        copyFiles.splice(copyFiles.indexOf(file), 1);

                        if (!copyFiles.length) {
                            callback();
                        }
                    }
                });
            }
        );
    }

    function copyNodeJS(nodeJSFile, dest, platform, callback) {
        dest = path.resolve(dest + path.sep + 'node');

        if (isWindows(platform)) {
            dest += '.exe';
        }

        copyFile(nodeJSFile, dest, callback);
    }

    function createZipFile(dirToWrap, platform) {
        var finalDir,
            outDirPlatform,
            target;

        target = path.resolve(program.dist + '/laut' + '_' + platform +  '_' + version + '.tar.gz');

        outDirPlatform = outputDir + path.sep + 'out' + path.sep + platform;

        fs.mkdirsSync(outDirPlatform);

        finalDir = outDirPlatform + path.sep + 'laut_' + platform + '_' + version;

        fs.rename(dirToWrap, finalDir, function(error) {
            if (error) {
                console.error(error);
            }
            else {
                new targz().compress(finalDir, target, function(error) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        console.log('The compression of: ' + target + ' has ended!');
                    }
                });
            }
        });
    }

    function extractNodeJS(file, callback) {
        var nodeJSFile = path.normalize(file + '_extracted');

        fs.mkdirsSync(nodeJSFile);

        new targz().extract(file, nodeJSFile, function(error) {
            callback(error, nodeJSFile);
        });
    }

    function isWindows(platform) {
        return platform.indexOf('win') === 0;
    }

    function processDownloadedFile(nodeJSFile, platform) {
        var dirToWrap,
            dirToWrapData;

        console.log('Processing: ' + nodeJSFile);

        dirToWrap = path.normalize(nodeJSFile + '_wrapped');

        fs.mkdirsSync(dirToWrap);

        copyExecutableFile(dirToWrap, platform, function(error) {
            if (error) {
                console.error(error);
            }
            else {
                copyNodeJS(nodeJSFile, dirToWrap, platform, function(error) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        // copy itself

                        dirToWrapData = path.normalize(dirToWrap + path.sep + 'data');

                        copyRequiredFiles(dirToWrapData, function() {
                            createZipFile(dirToWrap, platform);
                        });
                    }
                });
            }
        });
    }

    function onFileDownload(error, result, platform) {
        var basename,
            destFile,
            file,
            srcFile;

        file = result.file;

        if (isWindows(platform)) {
            processDownloadedFile(file, platform);
        }
        else {
            extractNodeJS(file, function(error, extractedFile) {
                if (error) {
                    console.error(error);
                }
                else {
                    basename = path.basename(extractedFile);

                    srcFile = extractedFile + path.sep + basename.substring(0, basename.lastIndexOf('.tar.gz'));

                    destFile = extractedFile + path.sep + 'node';

                    fs.rename(srcFile, destFile, function(error) {
                        if (error) {
                            console.error(error);
                        }
                        else {
                            processDownloadedFile(destFile, platform);
                        }
                    });
                }
            });
        }
    }

    // ENTRY point: download all dist files for the specified platforms

    process.on('exit', cleanup);
    process.on('uncaughtException', cleanup);

    program.platform.forEach(
        function(platform) {
            var fileName,
                platformURI,
                request;

            platformURI = uri[platform];

            if (platformURI) {
                platformURI = platformURI.replace(/\{version\}/g, program.nodejs);

                fileName = path.normalize(outputDir + path.sep + platformURI.substring(platformURI.lastIndexOf(path.sep)).replace('\.exe', '_' + platform + '.exe'));

                console.log('Downloading: ' + platformURI);

                request = http.get(platformURI, fileName, function(error, result) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        onFileDownload(error, result, platform);
                    }
                });
            }
            else {
                console.error('Unsupported platform: ' + platform);
            }
        }
    );
}());
