/**
 * @Destroy annotation
 */

var Annotation = require('conga-annotations').Annotation;

module.exports = Annotation.extend({
    annotation: 'Destroy',
    targets: [Annotation.METHOD]
});

