#!/usr/bin/env node

'use strict';

var exec = require('child_process').exec,
    https = require('https'),
    path = require('path'),
    laut = require(path.resolve(__dirname, '../lib')),
    program = require('commander'),
    Y = require('yui').use('promise'),

    version = laut.version,

    options = {
        headers: {
            'User-Agent': 'Liferay AUI Upgrade Tool https://github.com/liferay/liferay-aui-upgrade-tool'
        },
        hostname: 'api.github.com',
        method: 'GET',
        path: '/repos/liferay/liferay-aui-upgrade-tool/tags',
        port: 443
    };

    program
        .option('-l, --list [list versions]', 'Retrieve list with all available releases', false)
        .option('-c, --check [check version]', 'Check if LAUT is up to date', false)
        .option('-u, --update [update]', 'Update LAUT to the latest version', false)
        .parse(process.argv);

function isWindows() {
    return process.platform.indexOf('win') === 0;
}

function listVersions() {
    return new Y.Promise(function(resolve, reject) {
        https.request(options, function(response) {
            var data = '';

            response.on('data', function(chunk) {
                data += chunk;
            });

            response.on('error', function(error) {
                reject(error);
            });

            response.on('end', function () {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).end();
    });
}

// ENTRY Point

// list all released versions
if (program.list) {
    var releasePromise = listVersions();

    releasePromise.then(
        function(result) {
            result.forEach(
                function(item) {
                    console.log(item.name);
                }
            );
        },
        function(error) {
            console.log('Failure: ' + error);
        }
    );
}

// check if the current version is the last one

else if (program.check) {
    var releasePromise = listVersions();

    releasePromise.then(
        function(result) {
            console.log(result[0].name !== 'v' + version);
        },
        function(error) {
            console.log('Failure: ' + error);
        }
    );
}

// update LAUT

else if (program.update) {
    var nodeDir = process.execPath.substring(0, process.execPath.lastIndexOf(path.sep)),
        npmExec = nodeDir + '/npm' + (isWindows() ? '.cmd' : '');

    exec(npmExec + ' update',
        function(error, stdout, stderr) {
            if (error) {
                console.log(error);

                console.log(stderr);
            }
            else {
                console.log(stdout);
            }
        },
        {
            cwd: path.resolve(__dirname, '..')
        }
    );

}

else {
    console.log('No command specified, use -h to see the list of the available commands.');
}
