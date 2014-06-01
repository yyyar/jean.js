## jean.js

[![Build Status](https://travis-ci.org/yyyar/jean.js.svg?branch=master)](https://travis-ci.org/yyyar/jean.js) [![NPM version](https://badge.fury.io/js/jean.js.svg)](http://badge.fury.io/js/jean)

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

var MyBean1 = module.exports = function() {
    this.print = function() {
        console.log('hello world');
    };
};

MyBean1.$bean = 'myBean1';
MyBean1.$autowired = [];
```

myBean2.js
```javascript

var MyBean2 = module.exports = function() {
    var self = this;

    this.doWork = function() {
        self.$myBean1.print();
    };
};

MyBean2.$bean = 'myBean2';
MyBean2.$autowired = ['myBean1'];
```

Initializa Context, scan for beans and run.

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

