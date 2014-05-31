/**
 * hello.js - bean
 */

var Hello = module.exports = function() {

    var self = this;

    this.hello = function() {
        return 'hello ' + self.$world.world();
    };

};

Hello.$bean = 'hello';
Hello.$autowired = ['world'];

