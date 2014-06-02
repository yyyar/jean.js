/**
 * @Autowired annotation
 */

var Annotation = require('conga-annotations').Annotation;

module.exports = Annotation.extend({
    annotation: 'Autowired',
    targets: [Annotation.PROPERTY]
});

