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
     * @Destroy
     */
    destory: function(callback) {
        throw new Error("Exception in @Destroy");
    }
};

