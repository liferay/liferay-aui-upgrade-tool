(function() {
    'use strict';

    var handlerRegex = /((?:\.push[\s\r\n]*\(|[=:][\s\r\n]*\[|}[\s\r\n]*,)[\s\r\n]*{[\s\S]*?)(handler[\s\r\n]*:)[\s\r\n]*function/;

    function ChangeHandlerOnClick(config) {
        this._config = config;
    }

    ChangeHandlerOnClick.prototype = {
        constructor: ChangeHandlerOnClick,

        process: function(content, context) {
            var functionIndex,
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

                functionIndex = this._getFunctionContent(targetString);

                if (functionIndex >= 0) {
                    handlerWhitespaceIndex = this._getWhitespaceIndex(g1);

                    restPart = content.substring(0, offset);

                    res = restPart + 'on: {';

                    res += g1.substring(handlerWhitespaceIndex);

                    res += 'click:';

                    res += content.substr(targetOffset, functionIndex + 1);

                    res += '}';

                    restPart = content.substring(targetOffset + functionIndex + 1);

                    res += this.process(restPart, context);
                }
            }

            return res;
        },

        _getFunctionContent: function(content) {
            var character,
                found,
                htClosedParentheses,
                htOpenParentheses,
                i,
                lastParenthese,
                stack,
                targetOffset;

            htClosedParentheses = {
                '}': '{'
            };

            htOpenParentheses = {
                '{': 1
            };

            stack = [];

            for (i = 0; i < content.length; i++) {
                character = content.charAt(i);

                if (htOpenParentheses[character]) {
                    stack.push(character);
                }
                else if (htClosedParentheses[character]) {
                    if (stack.length === 0) {
                        break;
                    }

                    stack.pop();

                    if (stack.length === 0) {
                        found = true;
                        break;
                    }
                }
            }

            return found ? i : -1;
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