(function() {
    'use strict';

    function AddDeprecatedSuffixes(config) {
        this._config = config;

        this._prepare();
    }

    AddDeprecatedSuffixes.DEPRECATED_MODULES = require('../assets/deprecated-modules.json').DEPRECATED_MODULES;

    AddDeprecatedSuffixes.prototype = {
        constructor: AddDeprecatedSuffixes,

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

            AddDeprecatedSuffixes.PATTERNS.forEach(
                function(item) {
                    AddDeprecatedSuffixes.DEPRECATED_MODULES.forEach(
                        function(auiModule) {
                            instance._matches.push(
                                {
                                    match: new RegExp(item.match.replace('____', auiModule), 'gi'),
                                    replace: item.replace
                                }
                            );
                        }
                    );
                }
            );
        }
    };

    AddDeprecatedSuffixes.PATTERNS = [
        {
            desc: 'requires: [\'aui-live-search\']',
            match: '(requires(?:[\\s\\r\\n]*):(?:[\\s\\r\\n]*)\\[[^\\]]*[\'\"])(____)([\'\"][^\\]]*])',
            replace: function(match, g1, g2, g3) {
                return g1 + g2.replace(g2, g2 + '-deprecated') + g3;
            }
        },
        {
            desc: '},[\'aui-live-search\'',
            match: '(}[\\s\\r\\n]*,[\\s\\r\\n]*\\[[^\\][}{,]*[\'\\\"])(____)([\'\\\"][^\\]]*])',
            replace: function(match, g1, g2, g3) {
                return g1 + g2.replace(g2, g2 + '-deprecated') + g3;
            }
        },
        {
            desc: '<aui:script use="aui-base">',
            match: '(<aui:script use="(?:[,]?|[^"]*))(____)([",])',
            replace: function(match, g1, g2, g3) {
                return g1 + g2.replace(g2, g2 + '-deprecated') + g3;
            }
        }
    ];

    module.exports.AddDeprecatedSuffixes = AddDeprecatedSuffixes;
}());