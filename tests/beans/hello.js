/**
 * hello.js - bean
 */

var fs = require('fs');

/**
 * Hello Constructor
 */
var Hello = module.exports = function() {};

/**
 * Hello hello method
 */
Hello.prototype.hello = function() {
    return this.helloMsg + ' ' + this.$world.world();
};


/** ----- Jean properties ----- **/

/**
 * Bean name
 */
Hello.$bean = 'hello';

/**
 * Bean dependencies
 */
Hello.$autowired = ['world'];

/**
 * Bean init function
 */
Hello.$initialize = function(callback) {

    var self = this;

    console.log('[hello] $initialize');

    fs.readFile(__dirname + '/../resources/hello.txt', {encoding:'utf8'}, function(err, data) {
        self.helloMsg = data.trim();
        callback();
    });
};

/**
 * Called after all dependencies set
 */
Hello.$afterPropertiesSet = function() {
    console.log('[hello] $afterPropertiesSet');
};


