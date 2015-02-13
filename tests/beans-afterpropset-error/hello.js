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
     * @AfterPropertiesSet
     */
    afterPropsSet: function() {
        throw new Error("Exception in @AfterPropertiesSet");
    }
};

