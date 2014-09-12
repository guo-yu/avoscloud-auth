;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  // Inject as a angular module
  angular
    .module('avoscloud-auth', ['avoscloud'])
    .service('avoscloudAuth', ['', avoscloudAuth])
    .directive('avoscloudSignin', ['avoscloud', 'avoscloudAuth', signIn])
    .directive('avoscloudSigninSms', ['avoscloud', 'avoscloudAuth', signInViaSms])
    .directive('avoscloudSignup', ['avoscloud', 'avoscloudAuth', signUp])

  function avoscloudAuth() {
    var self = this;
    this.events = {};
    this.signin = {};
    this.signup = {};

    this.on = function(event, fn, type) {
      var vaild = event && fn && typeof(fn) === 'function';
      if (!valid) return;

      if (type && !this.events[type])
        this.events[type] = {};
      if (type)
        this.events[type][event] = fn;
      else 
        this.events[event] = fn;
    };

    this.emit = function(event, data, type) {
      if (type && self[type][event])
        return self[type][event](data);
      if (self.events[event])
        return self.events[event](data);
      return;
    }

    // init shortcuts
    angular.forEach(['signin', 'signup', 'signinSms'], function(item){
      self[item].on = function(event, fn) {
        return self.on(event, fn, item);
      };
      angular.forEach(['error', 'success'], function(type){
        self[item][type] = function(data) {
          if (type === 'error' && typeof(data) === string)
            data = new Error(data);
          return self.emit(type, data, item);
        };
      });
    });
  }

  function signIn(db, auth) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: createForm('signin'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;
      scope.updateAccount = updateAccount;

      console.log(ctrl);

      function signin() {
        if (!scope.password) 
          return auth.signin.error('no password');
        if (!scope.mobilePhoneNumber) 
          return auth.signin.error('no mobilePhoneNumber');

        db.login.get({
          password: scope.password,
          mobilePhoneNumber: scope.mobilePhoneNumber
        }, function(result) {
          if (result.sessionToken)
            db.headers('session', result.sessionToken);
          return auth.signin.success(result);
        }, auth.signin.error);
      }

      // view => model
      function updateAccount() {
        ctrl.$setViewValue({
          username: 'xxx',
          password: 'xxx'
        });
      }
    }
  }

  function signInViaSms(avoscloud, auth) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: createForm('signin-sms'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;

      function requestSmsCode() {
        if (!scope.mobilePhoneNumber)
          return auth.signinSms.error('no mobilePhoneNumber');

        db.requestLoginSmsCode.post({
          mobilePhoneNumber: scope.mobilePhoneNumber
        }, auth.signinSms.success, auth.signinSms.error);
      }

      function signin() {
        if (!scope.mobilePhoneNumber) 
          return auth.signinSms.error('no mobilePhoneNumber');
        if (!scope.smsCode)
          return auth.signinSms.error('valid sms code required');

        db.login.get({
          smsCode: scope.smsCode,
          mobilePhoneNumber: scope.mobilePhoneNumber
        }, auth.signinSms.success, auth.signinSms.error);
      }
    }
  }

  function signUp(db, auth) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: createForm('signup'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signup = signup;
      scope.verifyMobilePhone = verifyMobilePhone;

      function signup() {
        if (!scope.user) 
          return auth.signup.error('invalid user params');
        if (!scope.user.username) 
          return auth.signup.error('invalid user params');
        if (!scope.user.password) 
          return auth.signup.error('invalid user params');
        if (!scope.passwordConfirm) 
          return auth.signup.error('invalid user params');
        if (scope.user.password !== scope.passwordConfirm)
          return auth.signup.error('passwords are not match');

        // use mobile phone number as username
        scope.user.mobilePhoneNumber = scope.user.username;

        var baby = new db.users(scope.user);
        baby.$save(auth.signup.success, auth.signup.error);
      }

      function verifyMobilePhone() {
        if (!scope.smsCode)
        return scope.alert('请输入短信验证码!');

        var code = new db.verifyMobilePhone();

        code.$save({
          code: scope.smsCode
        }, auth.signup.success, auth.signup.error);
      }
    }
  }

  function createForm(type) {
    var forms = {};

    forms.signin = [
      '<form id="signinForm" class="signin-form" ng-submit="signin();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">手机</span>',
            '<input type="text" ng-model="mobilePhoneNumber" placeholder="137XXXXXXX">',
          '</label>',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">密码</span>',
            '<input type="password" ng-model="password" placeholder="********">',
          '</label>',
          '<button class="button button-full button-positive" type="submit">登录</button>',
        '</div>',
      '</form>'
    ].join('\n');

    forms.signup = [
      '<form id="signupForm" class="signup-form" ng-submit="signup();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">手机</span>',
            '<input type="text" ng-model="mobilePhoneNumber" placeholder="">',
          '</label>',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">密码</span>',
            '<input type="password" ng-model="password" placeholder="********">',
          '</label>',
          '<button class="button button-full button-positive" type="submit">登录</button>',
        '</div>',
      '</form>'
    ].join('\n');

    forms['signin-sms'] = [
      '<form id="signinForm" class="signin-form" ng-submit="signin();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">手机</span>',
            '<input type="text" ng-model="mobilePhoneNumber" placeholder="137XXXXXXX">',
          '</label>',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">密码</span>',
            '<input type="password" ng-model="password" placeholder="********">',
          '</label>',
          '<button class="button button-full button-positive" type="submit">登录</button>',
        '</div>',
      '</form>'
    ].join('\n');

    return forms[type];
  }

  function errorHandler(type) {
    return alert(type);
  }

})(window.angular, window.debug);
