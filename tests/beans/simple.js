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
     * @Autowired
     */
    context: null,

    /**
     * @Initialize
     */
    init: function(callback) {
        console.log('[simple] initialize');
        return callback();
    },

    /**
     * @AfterPropertiesSet
     */
    ready: function() {
        console.log('[simple] afterPropertiesSet');
    },

    doWork: function() {
        console.log('[simple] doWork ' + this.hello.hello());
        console.log('[simple] doWork accessContext: ' + this.context.name);
    }
};


