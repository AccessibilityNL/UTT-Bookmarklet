"use strict";

define(function () {
    return function (input) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return input.replace(/\{(\d+)\}/g, function (match, capture) {
            return args[1 * capture];
        });
    };
});
//# sourceMappingURL=strFormat.js.map