/**
 * hello.js - bean
 */

var fs = require('fs');

var Hello = module.exports = function() {};

Hello.prototype.hello = function() {
    return this.helloMsg + ' ' + this.$world.world();
};


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

    console.log('initializing hello...');

    fs.readFile(__dirname + '/../resources/hello.txt', {encoding:'utf8'}, function(err, data) {
        self.helloMsg = data.trim();
        callback();
    });
};



