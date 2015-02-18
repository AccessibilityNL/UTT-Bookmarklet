var should    = require('should');
var requirejs = require('requirejs');
requirejs.config({ baseUrl: ".tmp", paths: {"UTT/launcher": "launcher/scripts"} });

describe('Bookmerklet Launcher Main', function() {
    var main;

    before(function (done) {
        requirejs(['UTT/launcher/main'], function (__main__) {
            main = __main__;
            done();
        });
    });

    it('should be defined', function() {
        should.exist(main);
    });

});