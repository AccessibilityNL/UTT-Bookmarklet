"use strict";

define(["React", "./UttModule"], function (React, UttModule) {

  var i18n = undefined;

  var Reporter = React.createClass({ displayName: "Reporter",
    render: function render() {
      i18n = this.props.i18n;
      return React.createElement(UttModule, { className: "reporter", i18n: i18n }, React.createElement("h1", null, i18n((function () {
        var siteObj = ["Results list"];siteObj.raw = ["Results list"];Object.freeze(siteObj.raw);Object.freeze(siteObj);return siteObj;
      })())));
    }
  });
  return Reporter;
});
//# sourceMappingURL=Reporter.js.map