(function() {
    'use strict';

    function AddDeprecatedSuffixes(config) {
        this._config = config;

        this._prepare();
    }

    AddDeprecatedSuffixes.prototype = {
        process: function(content) {
            debugger;
            this._matches.forEach(
                function(item) {
                    console.log(item.match);
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

    AddDeprecatedSuffixes.DEPRECATED_MODULES = [
        'aui-autocomplete',
        'aui-autosize',
        'aui-base',
        'aui-button-item',
        'aui-chart',
        'aui-color-picker-base',
        'aui-color-picker',
        'aui-color-picker-grid-plugin',
        'aui-color-util',
        'aui-data-set',
        'aui-datasource-control-base',
        'aui-datasource-control',
        'aui-datepicker-base',
        'aui-datepicker',
        'aui-datepicker-select',
        'aui-delayed-task',
        'aui-dialog-iframe',
        'aui-editable',
        'aui-form-base',
        'aui-form-combobox',
        'aui-form',
        'aui-form-field',
        'aui-form-select',
        'aui-form-textarea',
        'aui-form-textfield',
        'aui-input-text-control',
        'aui-io',
        'aui-io-plugin',
        'aui-io-request',
        'aui-live-search',
        'aui-loading-mask',
        'aui-overlay-base',
        'aui-overlay-context',
        'aui-overlay-context-panel',
        'aui-overlay',
        'aui-overlay-manager',
        'aui-overlay-mask',
        'aui-panel',
        'aui-resize-base',
        'aui-resize-constrain',
        'aui-resize',
        'aui-scroller',
        'aui-simple-anim',
        'aui-skin',
        'aui-state-interaction',
        'aui-swf',
        'aui-template',
        'aui-textboxlist',
        'aui-tooltip',
        'aui-tpl-snippets-base',
        'aui-tpl-snippets-checkbox',
        'aui-tpl-snippets',
        'aui-tpl-snippets-input',
        'aui-tpl-snippets-select',
        'aui-tpl-snippets-textarea'
    ];

    AddDeprecatedSuffixes.PATTERNS = [
        {
            desc: 'requires: [\'aui-live-search\'] or },[\'aui-live-search\'',
            match: '(?:requires([\\s\\r\\n]*):|}\\1,\\1)\\[\\1[^\\]]*[\'"](____)[\'"]\\1[^\\]]*\\]',
            replace: function(match, g1, g2) {
                debugger;
                return g1 + g2.replace(/aui\-/g, '');
            }
        }
    ];

    module.exports.AddDeprecatedSuffixes = AddDeprecatedSuffixes;
}());