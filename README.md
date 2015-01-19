### jean.js

[![Build Status](https://travis-ci.org/yyyar/jean.js.svg?branch=master)](https://travis-ci.org/yyyar/jean.js) [![NPM version](https://badge.fury.io/js/jean.svg)](http://badge.fury.io/js/jean)

**jean.js** is small IoC library for Node.js inspired by Spring Framework IoC container

#### Caution!
jean.js is under development! Things may fail or work inconsistently. Feel free to make any suggestions and/or report bugs.

#### Installation
```bash
$ npm install jean
```

#### Usage
Create some beans

**myBean1.js**
```javascript
/**
 * @Bean('myBean1')
 */
var MyBean1 = module.exports = function() {};

MyBean1.prototype = {
    print: function() {
        console.log('hello world');
    }
};
```

**myBean2.js**
```javascript
/**
 * @Bean('myBean2')
 */
var MyBean2 = module.exports = function() {};

MyBean2.prototype = {

    /**
     * @Autowired
     */
    myBean1: null,

    doWork: function() {
        this.myBean1.print();
    }
};
```

Initialize Context, scan for beans and run.

**app.js**
```javascript
var JeanContext = require('jean');

var app = new JeanContext('myapp');
app.scan(__dirname, function() {

    app.getBean('myBean2').doWork();

});

// Call it when you want to shutdown context and all beans (see @Destroy annotation)
app.shutdown(function() {
    console.log("Shutdown done");
});

```

### Annotations
This section describe currently implemented annotations

#### `@Bean('name')`
This annotation marks your constructor as a "bean", it will be
automatically scanner and put into context. Please note that
you should keep only one bean per file and `module.exports` should
export the constructor of your bean.

```javascript
/**
 * @Bean('myBean')
 */
var MyBean = module.exports = function() {};

MyBean.prototype = {
    // implementation
};
```

#### `@Initialize`
If you mark any your prototype method definition with this annotation,
method would be invoked right after creating new instance of your bean
and putting it in the context, but *before* any autowired injections.
Async initializations are supported, your method will be passed with a callback,
and you need to invoke it after you complete initialization.

```javascript
/**
 * @Bean('myBean')
 */
var MyBean = module.exports = function() {};

MyBean.prototype = {

    /**
     * @Initialize
     */
    doInit: function(callback) {

        // emulating long initialization...
        setTimeout(function() {
            callback();
        }, 1000);
    }

};
```

#### `@Destroy`
If you mark any your prototype method definition with this annotation,
method would be invoked on context shutdown, i.e. when calling `jeanContext.shutdown()`.
Please note that beans in context would be destored in random order in parallel, so not make any assumptions on it.

```javascript
/**
 * @Bean('myBean')
 */
var MyBean = module.exports = function() {};

MyBean.prototype = {

    /**
     * @Destroy
     */
    destroy: function(callback) {

        // emulating long destroying
        setTimeout(function() {
            callback();
        }, 1000);
    }

};
```

#### `@Autowired`
If you mark your prototype property with this annotation, the dependency 
will be automatically injected in this property. Injected bean name should be
the same as your property name, othwerise you can set injected bean name by
providing parameter to annotation, for example: @Autowired('myRealBeanName').

```javascript
/**
 * @Bean('myBean')
 */
var MyBean = module.exports = function() {};

MyBean.prototype = {

    /**
     * @Autowired('anotherBean')
     */
    anotherBean: null,

    doWork: function() {
        this.anotherBean.doWork();
    }

};
```

#### `@AfterPropertiesSet`
If you mark any your prototype method definition with this annotation,
method would be invoked right after resolving all autowired dependencies.

```javascript
/**
 * @Bean('myBean')
 */
var MyBean = module.exports = function() {};

MyBean.prototype = {


    /**
     * @Autowired
     */
    anotherBean: null,

    /**
     * @AfterPropertiesSet
     */
    ready: function() {

        // can access another bean now
        this.anotherBean.doWork();
    
    }

};
```

#### Tests
```bash
$ sudo npm install nodeunit -g
$ npm test
```

#### Author
* [Yaroslav Pogrebnyak](https://github.com/yyyar/)

#### License
MIT

