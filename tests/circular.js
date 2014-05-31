/**
 * circular.js - circular DI test
 */

var JeanContext = require('../lib/jean');

module.exports = {

    'setUp': function(callback) {
        this.appContext = new JeanContext('coolApp');
        this.appContext.scan(__dirname + '/beans' , callback);
    },

    'Circular DI' : function(test) {
        test.equal(this.appContext.getBean('world').greeting(), 'hello world', 'Greeting!');
        test.done();
    }

};


