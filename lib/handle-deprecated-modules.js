(function() {
    'use strict';

    var modules = require('../assets/deprecated-modules.json');

    function HandleDeprecatedModules(config) {
        this._config = config;

        this._prepare();
    }

    HandleDeprecatedModules.DEPRECATED_MODULES = modules.DEPRECATED_MODULES;
    HandleDeprecatedModules.REMOVED_MODULES = modules.REMOVED_MODULES;

    function replaceDeprecated(match, g1, g2, g3) {
        return g1 + g2.replace(g2, g2 + '-deprecated') + g3;
    }

    function replaceRemoved(auiModule, match, g1, g2, g3) {
        return g1 + g2.replace(g2, auiModule) + g3;
    }

    HandleDeprecatedModules.prototype = {
        constructor: HandleDeprecatedModules,

        process: function(content, context) {
            this._matches.forEach(
                function(item) {
                    content = content.replace(
                        item.match, item.replace || '');
                }
            );

            return content;
        },

        _prepare: function() {
            var instance = this;

            instance._matches = [];

            HandleDeprecatedModules.PATTERNS.forEach(
                function(item) {
                    HandleDeprecatedModules.DEPRECATED_MODULES.forEach(
                        function(auiModule) {
                            instance._matches.push(
                                {
                                    match: new RegExp(item.match.replace('____', auiModule), 'gi'),
                                    replace: replaceDeprecated
                                }
                            );
                        }
                    );

                    HandleDeprecatedModules.REMOVED_MODULES.forEach(
                        function(removedModule) {
                            instance._matches.push(
                                {
                                    match: new RegExp(item.match.replace('____', removedModule.name), 'gi'),
                                    replace: replaceRemoved.bind(this, removedModule.value)
                                }
                            );
                        }
                    );
                }
            );
        }
    };

    HandleDeprecatedModules.PATTERNS = [
        {
            desc: 'requires: [\'aui-live-search\']',
            match: '(requires(?:[\\s\\r\\n]*):(?:[\\s\\r\\n]*)\\[[^\\]]*[\'\"])(____)([\'\"][^\\]]*])'
        },
        {
            desc: '},[\'aui-live-search\'',
            match: '(}[\\s\\r\\n]*,[\\s\\r\\n]*\\[[^\\][}{]*[\'\\\"])(____)([\'\\\"][^\\]]*])'
        },
        {
            desc: '<aui:script use="aui-base">',
            match: '(<aui:script[\\w\\-" =]+use="(?:[,]?|[^"]*))(____)([",])'
        },
        {
            desc: 'AUI().use(\'aui-dialog\', \'aui-io\', \'event\', \'event-custom\', function(A) {',
            match: '(\\).use\\([^)]*[\'"])(____)([\'"])'
        }
    ];

    module.exports.HandleDeprecatedModules = HandleDeprecatedModules;
}());