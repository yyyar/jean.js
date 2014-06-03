## jean.js

[![Build Status](https://travis-ci.org/yyyar/jean.js.svg?branch=master)](https://travis-ci.org/yyyar/jean.js) [![NPM version](https://badge.fury.io/js/jean.svg)](http://badge.fury.io/js/jean)

jean is small IoC library for Node.js inspired by Spring Framework IoC container

#### Caution!
jean is under development! It's not either stable not working as expected!
Get back in a few weeks for update! :)

#### Installation
```bash
$ npm install jean
```

#### Usage
Create some beans

myBean1.js
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

myBean2.js
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

app.js
```javascript
var JeanContext = require('jean');

var app = new JeanContext('myapp');
app.scan(__dirname, function() {

    app.getBean('myBean2').doWork();

});
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

