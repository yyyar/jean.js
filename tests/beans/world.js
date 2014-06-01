/**
 * world.js - bean
 */

var World = module.exports = function() {

    var self = this;

    this.world = function() {
        return 'world';
    };

    this.greeting = function() {
        return self.$hello.hello();
    };
};

/** ----- Jean properties ----- **/

World.$bean = 'world';

World.$autowired = ['hello'];

