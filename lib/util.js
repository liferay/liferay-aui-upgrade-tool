(function() {
    'use strict';

    var Util = {
        extractContent: function(content, htOpenParentheses, htClosedParentheses) {
            var character,
                found,
                i,
                lastParenthese,
                stack,
                targetOffset;

            htClosedParentheses = htClosedParentheses || {
                '}': '{'
            };

            htOpenParentheses = htOpenParentheses || {
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
        }
    };

    module.exports.Util = Util;
}());