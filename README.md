Liferay AUI Upgrade Tool
=============

What is it and why it would be useful
-------------

After the migration to Alloy 2.0 and Bootstrap, there are some changes, which have to be done in order to run successfully the already existing Portlets in Liferay Portal 6.2. Most of these changes should be done in JS, CSS and JSP files.
To be more easier to upgrade the code, we have created this tool. Depending on your code, it will do 80-100% of the needed changes.

How to run the tool
-------------

In general, you have two options:

### Running from the provided bundle for your OS ###

Liferay AUI Upgrade Tool is able to package itself for various operation systems, including Windows, OSX, GNU/Linux, SunOS.
For all of them it provides 32 or 64bit versions. If you have such package, you will have to untar/unzip it and run the script file. For Windows, it is called "run.bat". For all the others it is called "run.sh".

If you want to create such a package and provide it to other people, see [here](#distribute-the-tool).

### Downloading and running from GitHub ###

If you don't have a prepared package for your OS, then you can download the tool and run it manually:

1. Install NodeJS
2. Clone the repository (or just download the provided zip file from GitHub) and navigate to its directory
3. Install the reqiured modules:  
$ npm install commander fs-extra walkdir yuitest
4. Execute "node bin/laut.js -f projects/liferay/liferay-plugins"

where "projects/liferay/liferay-plugins" is the directory which contains the Portlets which have to be migrated.

Once you run it, the tool will change what is possible. As a developer, you will have to review the changes and accept or reject them. Even if you reject them, they will still be useful as a hint that something won't work in this case and you will have to apply manually a change there.

### Supported options ###
Liferay AUI Upgrade Tool supports various options:
````bash
$ node bin/laut.js --help

  Usage: laut.js [options]

  Options:

    -h, --help                   output usage information
    -f, --file [file name]       The file(s) to process.
    -e, --ext [file extensions]  The file extensions which should be processed. Defaults to "js, jsp, jspf, css".
    -V, --version                output the version number

````

_Note_:
If you have a bundle for your OS, you can pass these options to the run script too.

How fast is the tool
-------------

The whole directory which contains the [Liferay Plugins] (https://github.com/liferay/liferay-plugins/tree/master/portlets) is being processed for **3,55sec** on Apple Mac with 2.8 Ghz Intel Core i7 processor and 16 GB RAM.

What it does
-------------

1. Removes the "aui-" prefix from CSS classes in CSS, JS and JSP pages.
2. Adds '-deprecated' suffix to all deprecated modules in AlloyUI 2.0. The user can configure these, they are described in JSON format in "assets/deprecated-modules.json" file.
3. Renames CSS classes. There are some classes, which should be renamed. The user can configure these, they are described in JSON format in "assets/css-classes.json" file
4. Replaces the "inputCssClass" attribute in <aui:input>. "inputCssClass" is no more used. If there is "cssClass" attrbiute in <aui:input>, it adds the classes in "inputCssClass" after those in cssClass, otherwise it renames "inputCssClass" to "cssClass"
5. Replaces ".selector-button input" in all places, where we attach delegate events (or single listeners via .on) with ".selector-button"
6. Changes "handler: function(..."  to on : { click: function(... }. This is usually used on adding children to AUI Toolbar. See [here](https://github.com/ipeychev/liferay-aui-upgrade-tool/issues/9) for more information.

Running tests
-------------

The tool comes with unit tests, created using YUI Test. In order to run them:

1. Run:  
$ npm install yuitest

2. Execute:  
./node_modules/.bin/yuitest tests


Distribute the tool
-------------

The tool is able to create an achive, ready for distribution for Windows, GNU/Linux, and OSX, both 32 and 64 bit versions.

In order to create an archive for all platforms, go to the folder and execute:

$ node package/package.js

You will be able to pass some parameters, for example the platform or the dist directory. For more information, run node package/package.js --help:
```bash
$ node package/package.js --help

  Usage: package.js [options]

  Options:

    -h, --help                       output usage information
    -n, --nodejs [nodejs version]    The version of NodeJS to wrap [0.8.21] by default
    -d, --dist [destination folder]  The dist folder in which package should be created [dist] by default
    -p, --platform [build platform]  The platform, on which NodeJS should run ["win32", "win64", "osx32", "osx64", "gnu32", "gnu64"]
    -V, --version                    output the version number
````

Liferay AUI Upgrade Tool License
-------------

This library, _Liferay AUI Upgrade Tool_, is free software ("Licensed Software"); you can redistribute it and/or modify it under the terms of the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl-2.1.html) as published by the Free Software Foundation; either version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; including but not limited to, the implied warranty of MERCHANTABILITY, NONINFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.

You should have received a copy of the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl-2.1.html) along with this library; if not, write to the [Free Software Foundation, Inc.](http://www.fsf.org/), 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
