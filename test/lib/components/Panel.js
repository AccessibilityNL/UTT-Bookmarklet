var should    = require('should');
var requirejs = require('requirejs');
requirejs.config({ baseUrl: ".tmp", paths: {"UTT": "lib"} });

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('Bookmerklet Setup', function() {
    var Panel;
    var panelElm;

    before(function (done) {
        requirejs(['UTT/components/Panel'], function (__Panel__) {
            Panel = __Panel__;
            done();
        });
    });

    beforeEach(function () {
        panelElm = TestUtils.renderIntoDocument(
            React.createElement(Panel, null)
        );
    });

    it('should be defined', function() {
        should.exist(panelElm);
    });

});