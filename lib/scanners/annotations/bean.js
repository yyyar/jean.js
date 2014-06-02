/**
 * @Bean annotation
 */

var Annotation = require('conga-annotations').Annotation;

module.exports = Annotation.extend({
    annotation: 'Bean',
    targets: [Annotation.CONSTRUCTOR]
});

