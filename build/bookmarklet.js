"use strict";

(function () {

    var scriptSrc = document.getElementById("utt-bookmarklet").src;
    var rootPath = scriptSrc.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[0];
    var userKey = (scriptSrc.split("key=")[1] || "").split("&")[0];
    var modules = (scriptSrc.split("mds=")[1] || "").split("&")[0].split(",");

    function start() {
        require.config({
            baseUrl: rootPath,
            paths: {
                UTT: "lib",
                React: "bower_components/React/react"
            },
            shim: { exports: "React" }
        });

        require(["UTT/main"], function (UTT) {
            UTT.init({
                userKey: userKey,
                modules: modules,
                launch: true });
        });
    }

    if (typeof require === "undefined") {
        var s = document.createElement("script");
        s.onload = start;
        s.setAttribute("src", rootPath + "bower_components/requirejs/require.js");
        document.body.appendChild(s);
    } else {
        start();
    }
})();
//# sourceMappingURL=bookmarklet.js.map