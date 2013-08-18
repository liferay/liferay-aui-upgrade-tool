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
            match: 'requires(?:[\\s\\r\\n]*):(?:[\\s\\r\\n]*)\\[[^\\]]*[\'\"](____)[\'\"][^\\]]*]',
            replace: function(match, g1) {
                return match.replace(g1, g1 + '-deprecated');
            }
        },
        {
            desc: '},[\'aui-live-search\'',
            match: '}[\\s\\r\\n]*,[\\s\\r\\n]*\\[[^\\][}{,]*[\'\\\"](____)[\'\\\"][^\\]]*]',
            replace: function(match, g1) {
                return match.replace(g1, g1 + '-deprecated');
            }
        },
        {
            desc: '<aui:script use="aui-base">',
            match: '<aui:script\\s*use="(____)(?:"|,)',
            replace: function(match, g1) {
                return match.replace(g1, g1 + '-deprecated');
            }
        }
    ];

    module.exports.AddDeprecatedSuffixes = AddDeprecatedSuffixes;
}());