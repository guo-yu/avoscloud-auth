## avoscloud-auth

![screenshot](http://ww2.sinaimg.cn/large/61ff0de3gw1ekc3kwvvcxj20gd0ky75c.jpg)

the auth service and directive of avoscloud based on Angular.js and ionic UI.

### Installation
```bash
$ bower install avoscloud-auth --save
```

### Example
this directive will render a form which bind `$scope.user` model.
```html
<h2>Signin Form</h2>
<avoscloud-signin ng-model="user"></avoscloud-signin>

<h2>Signin via SMS Form</h2>
<avoscloud-signin-sms ng-model="user"></avoscloud-signin-sms>

<h2>Signup Form</h2>
<avoscloud-signup ng-model="user"></avoscloud-signup>
```
Javascript part:
```js
angular
  .module('app', ['avoscloud-auth'])
  .controller('avos', ['$scope', 'avoscloudAuth', function($scope, auth) {
    auth.signin.on('success', function(user) {
      console.log(user);
    });
    auth.signin.on('error', function(error) {
      console.log(error);
    });
  }]);
```

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2014 turing &lt;o.u.turing@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
![docor](https://raw.githubusercontent.com/turingou/docor/master/docor.png)
built upon love by [docor](https://github.com/turingou/docor.git) v0.2.0