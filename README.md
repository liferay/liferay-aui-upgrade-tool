Liferay AUI Upgrade Tool
=============

What is it and why it would be useful
-------------

After the migration to Alloy 2.0 and Bootstrap, there are some changes, which have to be done in order to run successfully the already existing Portlets in Liferay Portal 6.2. Most of these changes should be done in JS, CSS and JSP files.
To be more easier to upgrade the code, we have created this tool. Depending on your code, it will do 80-100% of the needed changes.

How to run the tool
-------------

1. Install NodeJS
2. Clone the repository and navigate to its directory
3. Install the reqiured modules:  
$ npm install commander fs-extra walkdir yuitest
4. Execute "node bin/laut.js -f projects/liferay/liferay-plugins"

where "projects/liferay/liferay-plugins" is the directory which contains the Portlets which have to be migrated.

Once you run it, the tool will change what is possible. As a developer, you will have to review the changes and accept or reject them. Even if you reject them, they will still be useful as a hint that something won't work in this case and you will have to apply manually a change there.

How fast is the tool
-------------

The whole directory which contains the [Liferay Plugins] (https://github.com/liferay/liferay-plugins/tree/master/portlets) is being processed for **3,55sec** on Apple Mac with 2.8 Ghz Intel Core i7 processor and 16 GB RAM.

What is does
-------------

1. Removes the "aui-" prefix from CSS classes in CSS, JS and JSP pages.
2. Adds '-deprecated' suffix to all deprecated modules in AlloyUI 2.0. The user can configure these, they are described in a JSON format in "assets/deprecated-modules.json" file.
3. Renames CSS classes. There are some classes, which should be renamed. The user can configure these, they are described in JSON format in "assets/css-classes.json" file
4. Replaces the "inputCssClass" attribute in <aui:input>. "inputCssClass" is no more used. If there is "cssClass" attrbiute in <aui:input>, it adds the classes in "inputCssClass" after those in cssClass, otherwise it renames "inputCssClass" to "cssClass"
5. Replaces ".selector-button input" in all places, where we attach delegate events (or single listeners via .on) with ".selector-button"

Running tests
-------------

The tool comes with unit tests, created using YUI Test. In order to run them:

1. Run:  
$ npm install yuitest

2. Execute:  
./node_modules/.bin/yuitest tests
