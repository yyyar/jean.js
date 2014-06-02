/**
 * @AfterPropertiesSet annotation
 */

var Annotation = require('conga-annotations').Annotation;

module.exports = Annotation.extend({
    annotation: 'AfterPropertiesSet',
    targets: [Annotation.METHOD]
});

