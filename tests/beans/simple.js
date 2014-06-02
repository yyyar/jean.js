/**
 * simple.js
 */

/**
 * @Bean('simple')
 */
var Simple = module.exports = function() {};

/**
 * Implementation
 */
Simple.prototype = {

    /**
     * @Autowired
     */
    hello: null,

    /**
     * @Initialize
     */
    init: function(callback) {
        console.log('[simple] initialize');
        return callback();
    },

    doWork: function() {
        console.log('[simple] doWork ' + this.hello.hello());
    }
};


