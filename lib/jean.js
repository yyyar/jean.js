/**
 * jean.js - Spring-inspired IoC library for Node.js
 *
 * @author Yaroslav Pogrebnyak <yyyaroslav@gmail.com>
 */

var fs = require('fs'),
    _ = require('lodash'),
    recursive = require('recursive-readdir');

/**
 * Jeans Application Context
 */
var JeanContext = module.exports = function(appName, config) {

    /**
     * Application Context name
     */
    this.appName = appName || 'JeansApp';

    /**
     * Configuration
     */
    this.config = _.merge({
        'scan' : {
            'path': null,
            'exclude' : ['node_modules']
        }
    }, config);

    /**
     * Registered beans
     */
    this.beans = {};

    /**
     * Unresolved beans dependencies
     */
    this.unresolvedDeps = {};

};

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
        throw new Error('You should provide path as an argument or in config.scan.path variable');
    }

    recursive(path, self.config.scan.exclude, function (err, files) {
        var i = 0;

        var processFile = function(file) {

            if (!file) {
                return callback();
            }

            try {
                var m = require(file);
                if (m.$bean) {
                    self.register(m.$bean, m, function() {
                        processFile(files[i++]);
                    });
                }
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
JeanContext.prototype.resolveDependers = function(depName, depBean) {

    var self = this;

    _.each(self.unresolvedDeps, function(depsNames, beanName) {

        var bean = self.beans[beanName];

        if (_.remove(depsNames, function(name) { return name === depName; } )) {
            self.beans[beanName]['$'+depName] = depBean;
        }

        // Remove key if no unresolved dependencies left
        if (_.isEmpty(depsNames)) {
            delete self.unresolvedDeps[beanName];

            bean.$afterPropertiesSet = _.bind(bean.constructor.$afterPropertiesSet || function(c){c();}, bean);
            bean.$afterPropertiesSet();
        }
    });
};

/**
 * Register bean
 */
JeanContext.prototype.register = function(beanName, beanClass, callback) {

    var self = this;

    if (!beanClass) {
        beanClass = beanName;
        beanName = beanClass.$bean;
    }

    if (!beanName) {
        throw Error('No name provided for bean ' + beanClass);
    }

    if (self.beans[beanName]) {
        throw new Error(beanName + ' already in context');
    }

    var bean = self.beans[beanName] = new beanClass();
    bean.$initialize = _.bind(beanClass.$initialize || function(c){c();}, bean);
    bean.$initialize(function() {
        bean.$appContext = self;

        self.resolveDependers(beanName, bean);

        if (beanClass.$autowired) {
            _.each(beanClass.$autowired, function(depName) {
                if (self.beans[depName]) {
                    bean['$'+depName] = self.beans[depName];
                } else {
                    self.unresolvedDeps[beanName] = self.unresolvedDeps[beanName] || [];
                    self.unresolvedDeps[beanName].push(depName);
                }
            });
        }

        if (_.isEmpty(self.unresolvedDeps[beanName])) {
            bean.$afterPropertiesSet = _.bind(beanClass.$autoPropertiesSet || function(c){c();}, bean);
            bean.$afterPropertiesSet();
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
JeanContext.prototype.validate = function() {
    return this.unresolvedDeps;
};

