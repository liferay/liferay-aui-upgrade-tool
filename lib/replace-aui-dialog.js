(function() {
    'use strict';

    var Util = require('./util.js').Util,

        handlerRegex = /(new[\s\r\n]+A.Dialog[\s\r\n]*\([\s\r\n]*){/;

    function ReplaceAUIDialog(config) {
        this._config = config;
    }

    ReplaceAUIDialog.prototype = {
        constructor: ReplaceAUIDialog,

        process: function(content, context) {
            var paramsIndex,
                g1,
                g2,
                match,
                matchedText,
                offset,
                res,
                restPart,
                targetOffset,
                targetString;

            res = content;

            match = handlerRegex.exec(content);

            if (match !== null) {
                g1 = match[1]; // the whole match, before the {
                matchedText = match[0];
                offset = match.index;
                targetOffset = offset + g1.length;

                targetString = content.substring(targetOffset);

                paramsIndex = Util.extractContent(targetString);

                if (paramsIndex >= 0) {
                    restPart = content.substring(0, offset);

                    res = restPart + 'Liferay.Util.Window.getWindow(\n{\ndialog: ';

                    res += content.substr(targetOffset, paramsIndex + 1);

                    res += '}';

                    restPart = content.substring(targetOffset + paramsIndex + 1);

                    res += this.process(restPart, context);
                }
            }

            return res;
        },

        _getWhitespaceIndex: function(string) {
            var character,
                htWhitespace,
                index = string.length;

            htWhitespace = {
                ' ': 1,
                '\t': 1,
                '\n': 1,
                '\r': 1
            };

            while(htWhitespace[string.charAt(--index)]);

            return ++index;
        }
    };

    module.exports.ReplaceAUIDialog = ReplaceAUIDialog;
}());