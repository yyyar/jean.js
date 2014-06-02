/**
 * @Initialize annotation
 */

var Annotation = require('conga-annotations').Annotation;

module.exports = Annotation.extend({
    annotation: 'Initialize',
    targets: [Annotation.METHOD, Annotation.PROPERTY]
});

