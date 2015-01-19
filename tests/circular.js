/**
 * circular.js - circular DI test
 */

var JeanContext = require('../lib/jean');

module.exports = {

    'setUp': function(callback) {

        this.appContext = new JeanContext('coolApp');
        this.appContext.scan(__dirname + '/beans' , function(err) {
            if (err) {
                console.log(err);
            } else {
                callback();
            }
        });
    },


    'Circular DI' : function(test) {
        this.appContext.getBean('simple').doWork();
        test.equal(this.appContext.getBean('world').greeting(), 'hello world', 'Greeting!');

        // Shutdown context, calling all destroy handlers for each bean
        this.appContext.shutdown(function() {
            test.done();
        });
    }

};


