define(function () {
    return function (input, ...args) {
        return input.replace(/\{(\d+)\}/g, (match, capture) => args[1 * capture]);
    };
});