(function() {
    'use strict';

    var Util = require('./util.js').Util,

        handlerRegex = /((?:\.push[\s\r\n]*\(|[=:][\s\r\n]*\[|}[\s\r\n]*,)[\s\r\n]*{[\s\S]*?)(handler[\s\r\n]*:)[\s\r\n]*function/;

    function ChangeHandlerOnClick(config) {
        this._config = config;
    }

    ChangeHandlerOnClick.prototype = {
        constructor: ChangeHandlerOnClick,

        process: function(content, context) {
            var contentIndex,
                g1,
                g2,
                handlerWhitespaceIndex,
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
                g1 = match[1];
                g2 = match[2];
                matchedText = match[0];
                offset = match.index + g1.length;

                targetOffset = offset + g2.length;

                targetString = content.substring(targetOffset);

                contentIndex = Util.extractContent(targetString);

                if (contentIndex >= 0) {
                    handlerWhitespaceIndex = this._getWhitespaceIndex(g1);

                    restPart = content.substring(0, offset);

                    res = restPart + 'on: {';

                    res += g1.substring(handlerWhitespaceIndex);

                    res += 'click:';

                    res += content.substr(targetOffset, contentIndex + 1);

                    res += '}';

                    restPart = content.substring(targetOffset + contentIndex + 1);

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

    module.exports.ChangeHandlerOnClick = ChangeHandlerOnClick;
}());