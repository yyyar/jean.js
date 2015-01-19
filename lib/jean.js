/**
 * jean.js - Spring-inspired IoC library for Node.js
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var fs = require('fs'),
    _ = require('lodash'),
    async = require('async'),
    recursive = require('recursive-readdir');

/**
 * Jean Application Context
 */
var JeanContext = module.exports = function(name, config) {

    /**
     * Application Context name
     */
    this.name = name || 'JeanContext';

    /**
     * Bean scanners
     */
    this.scanners = {
        'annotated': require('./scanners/annotated')
    };

    /**
     * Configuration
     */
    this.config = _.merge({
        'scan' : {
            'path': null,
            'type': 'annotated',
            'exclude' : ['node_modules']
        }
    }, config);

    /**
     * Registered beans
     */
    this.beans = {
        'context': this
    };

    /**
     * Descriptors
     */
    this.descriptors = {};

    /**
     * Unresolved beans dependencies
     */
    this.unresolvedDeps = {};

};

/**
 * Register beans from descriptors file
 */
JeanContext.prototype.load = function(path, callback) {

    var self = this;

    var descriptors = require(path);
    _.each(descriptors, function(descriptor) {
        this.register(descriptor);
    });

    return self.validate(callback);
};

/**
 * Shutdown context destroying all beans
 */
JeanContext.prototype.shutdown = function(callback) {

    var self = this;

    async.each(_.keys(this.beans), function(name, callback) {
        var bean = self.beans[name];
        if (bean == self) {
            return callback();
        }
        var destroyName = self.descriptors[name].destroy;
        if (destroyName) {
            bean[destroyName](callback);
        } else {
            callback();
        }
    }, callback);
}

/**
 * Scan and register beans
 */
JeanContext.prototype.scan = function(path, callback) {

    var self = this;

    if (!callback) {
        callback = path;
        path = self.config.scan.path;
    }

    if (!path) {
        callback(new Error('You should provide path as an argument or in config.scan.path variable'));
    }

    recursive(path, self.config.scan.exclude, function (err, files) {
        var i = 0;

        var processFile = function(file) {

            if (!file) {
                return self.validate(callback);
            }

            try {
                self.scanners[self.config.scan.type](file, function(err, val) {

                    if (err) {
                        return callback(err);
                    }

                    if (val) {
                        self.register(val, function() {
                            processFile(files[i++]);
                        });
                    }
                });
            }
            catch(e) {
                processFile(files[i++]);
            }

        };

        processFile(files[i++]);

    });
};

/**
 * Try to inject (resolve) bean obj with name
 * to already registered beans
 */
JeanContext.prototype.resolveDependers = function(childName, childBean) {

    var self = this;

    _.each(self.unresolvedDeps, function(ownerDeps, ownerName) {

        var owner = self.beans[ownerName];

        var dep = _.remove(ownerDeps, function(d) { return d.val === childName; } )[0];
        if (dep) {
            owner[dep.var] = childBean;
        }

        // Remove key if no unresolved dependencies left
        if (_.isEmpty(ownerDeps)) {
            delete self.unresolvedDeps[ownerName];

            if (owner[self.descriptors[ownerName].afterPropertiesSet]) {
                _.bind(owner[self.descriptors[ownerName].afterPropertiesSet], owner)();
            }
        }
    });
};

/**
 * Register bean
 * Descriptor: {
 *   name - bean name,
 *   class - constructor,
 *   initialize - init function name,
 *   autowired: [ {
 *      var - bean variable inject to
 *      val - name of bean to inject
 *   }...]
 * }
 */
JeanContext.prototype.register = function(descriptor, callback) {

    var self = this;

    var beanClass = descriptor.class;
    var beanName = descriptor.name;

    self.descriptors[beanName] = descriptor;

    if (!beanClass) {
        beanClass = beanName;
        beanName = beanClass.$bean;
    }

    if (!beanName) {
        callback(new Error('No name provided for bean ' + beanClass));
    }

    if (self.beans[beanName]) {
        callback(new Error(beanName + ' already in context'));
    }

    var bean = self.beans[beanName] = new beanClass();
    bean.$context = self;

    var initialize = descriptor.initialize ? _.bind(bean[descriptor.initialize],bean) : _.bind(function(c){c();}, bean);
    initialize(function() {

        self.resolveDependers(beanName, bean);

        if (descriptor.autowired) {
            _.each(descriptor.autowired, function(dep) {
                var depName = dep.val;
                if (self.beans[depName]) {
                    bean[dep.var] = self.beans[depName];
                } else {
                    self.unresolvedDeps[beanName] = self.unresolvedDeps[beanName] || [];
                    self.unresolvedDeps[beanName].push(dep);
                }
            });
        }

        if (_.isEmpty(self.unresolvedDeps[beanName]) && descriptor.afterPropertiesSet && bean[descriptor.afterPropertiesSet]) {
            _.bind(bean[descriptor.afterPropertiesSet], bean)();
        }

        callback();
    });
};

/**
 * Get registered bean intance
 */
JeanContext.prototype.getBean = function(beanName) {
    return this.beans[beanName];
};

/**
 * Validate context
 */
JeanContext.prototype.validate = function(callback) {
    var errs = this.unresolvedDeps;

     if (_.isEmpty(errs)) {
        return callback();
     } else {
         var msg = 'Cant resolve few dependencies: ';
         _.each(errs, function(deps, name) {
            msg += name + ' (';
            _.each(deps, function(dep) {
                msg += 'prototype.' + dep.var + '->' + dep.val;
            });
            msg += '), ';
        });
        return callback(new Error(msg));
     }
};

