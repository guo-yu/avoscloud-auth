;(function(angular) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  // Inject as a angular module
  angular
    .module('avoscloud-auth', ['avoscloud'])
    .directive('avoscloudSignin', ['avoscloud', signIn])
    .directive('avoscloudSigninSms', ['avoscloud', signInViaSms])
    .directive('avoscloudSignup', ['avoscloud', signUp])

  function signIn(avoscloud) {
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

  function signInViaSms(avoscloud) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: createForm('signin-sms'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;
      
      function signin() {
        
      }
    }
  }

  function signUp(avoscloud) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: createForm('signup'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {

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

})(window.angular);
