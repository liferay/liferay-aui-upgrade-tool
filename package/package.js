(function() {
    'use strict';

    var fs = require('fs-extra'),
        http = require('http-get'),
        path = require('path'),
        program = require('commander'),
        spawn = require('child_process').spawn,
        targz = require('tar.gz'),
        Y = require('yui').use('promise'),

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

    function copyFile(src, dest) {
        return new Y.Promise(function(resolve, reject) {
            var isDir = fs.statSync(src).isDirectory();

            if (isDir) {
                fs.mkdirsSync(dest);
            }

            fs.copy(src, dest, function(error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(dest);
                }
            });
        });
    }

    function copyExecutableFile(value) {
        return new Y.Promise(function(resolve, reject) {
            var executableFile;

            executableFile = isWindows(value.platform) ? 'run.bat' : 'run.sh';

            var cpPromise = copyFile(path.resolve(__dirname, executableFile), value.dirToWrap + path.sep + executableFile);

            cpPromise.then(function() {
                resolve(value);
            },
            function(error) {
                reject(error);
            });
        });
    }

    function copyItself(value) {
        return new Y.Promise(function(resolve, reject) {
            var dirToWrapData = path.normalize(value.dirToWrap + path.sep + 'data');

            value.dirToWrapData = dirToWrapData;

            var cpRequiredFilesPromise = copyRequiredFiles(value);

            cpRequiredFilesPromise.then(
                function() {
                    resolve(value);
                },
                function(error) {
                    reject(error);
                }
            );
        });
    }

    function copyRequiredFiles(value) {
        return new Y.Promise(function(resolve, reject) {
            var copyFiles = files.slice(0);

            copyFiles.forEach(
                function(file) {
                    var cpPromise,
                        dest,
                        src;

                    dest = path.normalize(value.dirToWrapData + path.sep + file);
                    src = path.resolve(__dirname, '../', file);

                    cpPromise = copyFile(src, dest);

                    cpPromise.then(
                        function() {
                            copyFiles.splice(copyFiles.indexOf(file), 1);

                            if (!copyFiles.length) {
                                resolve(value);
                            }
                        },
                        function(error) {
                            reject(error);
                        }
                    );
                }
            );
        });
    }

    function copyNodeJS(value) {
        return new Y.Promise(function(resolve, reject) {
            var cpPromise,
                dest = path.resolve(value.dirToWrap + path.sep + 'node');

            if (isWindows(value.platform)) {
                dest += '.exe';
            }

            cpPromise = copyFile(value.file, dest);

            cpPromise.then(
                function() {
                    resolve(value);
                },
                function(error) {
                    reject(error);
                }
            );
        });
    }

    function createZipFile(value) {
        return new Y.Promise(function(resolve, reject) {
            var finalDir,
                outDirPlatform,
                target;

            target = path.resolve(program.dist + '/laut' + '_' + value.platform +  '_' + version + '.tar.gz');

            outDirPlatform = outputDir + path.sep + 'out' + path.sep + value.platform;

            fs.mkdirsSync(outDirPlatform);

            finalDir = outDirPlatform + path.sep + 'laut_' + value.platform + '_' + version;

            fs.rename(value.dirToWrap, finalDir, function(error) {
                if (error) {
                    reject(error);
                }
                else {
                    new targz().compress(finalDir, target, function(error) {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log('The compression of: ' + target + ' has ended!');

                            resolve(value);
                        }
                    });
                }
            });
        });
    }

    function downloadFile(fileName, platformURI, platform) {
        return new Y.Promise(function(resolve, reject) {
            var request;

            console.log('Downloading: ' + platformURI);

            request = http.get(platformURI, fileName, function(error, result) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({
                        file: fileName,
                        platform: platform
                    });
                }
            });
        });
    }

    function isWindows(platform) {
        return platform.indexOf('win') === 0;
    }

    function prepareDownloadedFile(value) {
        return new Y.Promise(function(resolve, reject) {
            var dirToWrap,
                nodeJSFile;

            nodeJSFile = value.file;

            console.log('Processing: ' + nodeJSFile);

            dirToWrap = path.normalize(nodeJSFile + '_wrapped');

            fs.mkdirsSync(dirToWrap);

            value.dirToWrap = dirToWrap;

            resolve(value);
        });
    }

    function extractFile(value) {
        return new Y.Promise(function(resolve, reject) {
            var extractTGZPromise,
                file,
                nodeJSFile,
                platform;

            platform = value.platform;

            if (isWindows(platform)) {
                resolve(value);
            }
            else {
                file = value.file;

                nodeJSFile = path.normalize(file + '_extracted');

                fs.mkdirsSync(nodeJSFile);

                value.nodeJSFile = nodeJSFile;

                extractTGZPromise = extractTarGZFile(value);

                extractTGZPromise.then(
                    function() {
                        resolve(value);
                    },
                    function(error) {
                        reject(error);
                    }
                );
            }
        });
    }

    function extractTarGZFile(value) {
        return new Y.Promise(function(resolve, reject) {
            var basename,
                destFile,
                srcFile;

            new targz().extract(value.file, value.nodeJSFile, function(error) {
                if (error) {
                    reject(error);
                }
                else {
                    basename = path.basename(value.nodeJSFile);

                    srcFile = value.nodeJSFile + path.sep + basename.substring(0, basename.lastIndexOf('.tar.gz'));

                    destFile = value.nodeJSFile + path.sep + 'node';

                    fs.rename(srcFile, destFile, function(error) {
                        if (error) {
                            reject(error);
                        }
                        else {
                            value.file = destFile;

                            resolve(value);
                        }
                    });
                }
            });
        });
    }

    function reportError(error) {
        console.error(error);
    }

    // ENTRY point: download all dist files for the specified platforms

    process.on('exit', cleanup);
    process.on('uncaughtException', cleanup);

    program.platform.forEach(
        function(platform) {
            var fileName,
                platformURI;

            platformURI = uri[platform];

            if (platformURI) {
                platformURI = platformURI.replace(/\{version\}/g, program.nodejs);

                fileName = path.normalize(outputDir + path.sep + platformURI.substring(platformURI.lastIndexOf('/')).replace(/\.exe/, '_' + platform + '.exe'));

                downloadFile(fileName, platformURI, platform)
                    .then(extractFile)
                    .then(prepareDownloadedFile)
                    .then(copyExecutableFile)
                    .then(copyNodeJS)
                    .then(copyItself)
                    .then(createZipFile, reportError);
            }
            else {
                console.error('Unsupported platform: ' + platform);
            }
        }
    );
}());
