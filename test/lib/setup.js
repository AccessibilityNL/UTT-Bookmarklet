var should    = require('should');
var requirejs = require('requirejs');
requirejs.config({ baseUrl: ".tmp", paths: {"UTT": "lib"} });

describe('Bookmerklet Setup', function() {
    var setup;

    before(function (done) {
        requirejs(['UTT/setup'], function (__setup__) {
            setup = __setup__;
            done();
        });
    });

    it('should be defined', function() {
        should.exist(setup);
    });

});