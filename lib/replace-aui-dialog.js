(function() {
    'use strict';

    function ReplaceAUIDialog(config) {
        this._config = config;

        this._prepare();
    }

    ReplaceAUIDialog.DEPRECATED_MODULES = require('../assets/deprecated-modules.json').DEPRECATED_MODULES;

    ReplaceAUIDialog.prototype = {
        constructor: ReplaceAUIDialog,

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

            ReplaceAUIDialog.PATTERNS.forEach(
                function(item) {
                    ReplaceAUIDialog.DEPRECATED_MODULES.forEach(
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

    ReplaceAUIDialog.PATTERNS = [
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
            match: '(<aui:script[\\w\\-" =]+use="(?:[,]?|[^"]*))(____)([",])',
            replace: function(match, g1, g2, g3) {
                return g1 + g2.replace(g2, g2 + '-deprecated') + g3;
            }
        }
    ];

    module.exports.ReplaceAUIDialog = ReplaceAUIDialog;
}());