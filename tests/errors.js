/**
 * errors.js - errors tests
 */

var JeanContext = require('../lib/jean');

module.exports = {

    'Can catch error in @Destroy': function(test) {

        var appContext = new JeanContext('app');
        appContext.scan(__dirname + '/beans-destroy-error' , function(err) {
            appContext.shutdown(function(err) {
                console.log(err);
                test.done();
            });
        });
    },

    'Can catch error in @Initialize': function(test) {

        var appContext = new JeanContext('app');
        appContext.scan(__dirname + '/beans-initialize-error' , function(err) {
            if (err) {
                console.log(err);
                test.done()
            }
        });
    },


    'Can catch error in @AfterPropertiesSet': function(test) {

        var appContext = new JeanContext('app');
        appContext.scan(__dirname + '/beans-afterpropset-error' , function(err) {
            if (err) {
                console.log(err);
                test.done()
            }
        });
    }

};


