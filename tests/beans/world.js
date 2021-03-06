/**
 * world.js - bean
 */

/**
 * @Bean('world')
 */
var World = module.exports = function() {};

World.prototype = {

    /**
     * @Autowired
     */
    hello: null,

    /**
     * @Initialize
     */
    init: function(callback) {
        console.log('[world] initialize');
        callback();
    },

    /**
     * @Destroy
     */
    destroy: function(callback) {
        console.log("[world] destroy");
        callback();
    },

    world: function() {
        return 'world';
    },

    greeting: function() {
        return this.hello.hello();
    }
};

