(function() {
    'use strict';

    var Util = require('./util.js').Util,

        formRegex = /<form[\s\S]+?<(?:input|textarea|button|select) [\s\S]+?<\/form>/i,
        inputRegex = /(<(?:input|textarea|button|select)[\s]+.*name[\s\r\n]*=[\s\r\n]*)(['"])(?!<)/gi;

    function AddNamespaceInput(config) {
        this._config = config;
    }

    AddNamespaceInput.prototype = {
        constructor: AddNamespaceInput,

        process: function(content, context) {
            var paramsIndex,
                g1,
                match,
                offset,
                res,
                restPart,
                targetOffset;

            res = content;

            match = formRegex.exec(content);

            if (match !== null) {
                g1 = match[0]; // the whole <form>...</form>

                offset = match.index;

                targetOffset = offset + g1.length;

                restPart = content.substring(targetOffset);

                res = content.substring(0, offset); // the content from 0 to the <form

                res += this._processInput(g1); // process the content between <form>....</form>

                res += this.process(restPart, context); // the content from form> till the end
            }

            return res;
        },

        _processInput: function(content) {
            content = content.replace(inputRegex, function(match, g1, g2) {
                return g1 + g2 + '<portlet:namespace />';
            });

            return content;
        }
    };

    module.exports.AddNamespaceInput = AddNamespaceInput;
}());