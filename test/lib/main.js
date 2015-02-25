var should    = require('should');
var requirejs = require('requirejs');
requirejs.config({ baseUrl: ".tmp", paths: {"UTT": "lib"} });

describe('UTT main', function() {
    var UTT;

    before(function (done) {
        requirejs(['UTT/main'], function (main) {
            UTT = main;
            done();
        });
    });

    it('should be defined', function() {
        should.exist(UTT);
    });

});