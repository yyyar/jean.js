/**
 * Annotation scanner
 */

var annotations = require('conga-annotations'),
    path = require('path');


/* prepare registry */

var registry = new annotations.Registry();

registry.registerAnnotation(path.join(__dirname + '/annotations', 'autowired'));
registry.registerAnnotation(path.join(__dirname + '/annotations', 'bean'));
registry.registerAnnotation(path.join(__dirname + '/annotations', 'initialize'));
registry.registerAnnotation(path.join(__dirname + '/annotations', 'afterPropertiesSet'));
registry.registerAnnotation(path.join(__dirname + '/annotations', 'destroy'));


/* module exports */

module.exports = function(f, callback) {

    // prepare descriptor
    var descriptor = {
        autowired: []
    };

    var reader = new annotations.Reader(registry);
    reader.parse(f);

    var constructorAnnotations = reader.getConstructorAnnotations();
    var methodAnnotations = reader.getMethodAnnotations();
    var propertyAnnotations = reader.getPropertyAnnotations();

    var i,
        annotation;

    for (i in constructorAnnotations) {
        annotation = constructorAnnotations[i];
        if (annotation.annotation === 'Bean'){
            descriptor.name = annotation.value;
        }
    }

    for (i in methodAnnotations) {
        annotation = methodAnnotations[i];
        if (annotation.annotation === 'Initialize'){
            descriptor.initialize = annotation.target;
        }
        if (annotation.annotation === 'AfterPropertiesSet'){
            descriptor.afterPropertiesSet = annotation.target;
        }
        if (annotation.annotation === 'Destroy'){
            descriptor.destroy = annotation.target;
        }
    }

    for (i in propertyAnnotations) {
        annotation = propertyAnnotations[i];
        if (annotation.annotation === 'Autowired'){
            descriptor.autowired.push({
                'var': annotation.target,
                'val': annotation.value || annotation.target
            });
        }
    }

    if (!descriptor.name) {
        return callback(null, {});
    }

    try {
        descriptor['class'] = require(f);
    } catch(e) {
        return callback(e);
    }

    return callback(null, descriptor);
};

