/**
 * hello.js - bean
 */

var fs = require('fs');

/**
 * @Bean('hello')
 */
var Hello = module.exports = function() {};

Hello.prototype = {

    /**
     * @Autowired
     */
    world: null,

    /**
     * @Initialize
     */
    init: function(callback) {
        var self = this;
        console.log('[hello] initialize');
        fs.readFile(__dirname + '/../resources/hello.txt', {encoding:'utf8'}, function(err, data) {
            self.helloMsg = data.trim();
            callback();
        });
    },

    hello: function() {
        return this.helloMsg + ' ' + this.world.world();
    }

};

