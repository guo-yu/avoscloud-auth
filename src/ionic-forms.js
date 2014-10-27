;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  angular
    .module('avoscloud-auth')
    .service('avoscloud-ionic-form', ionicForms);

  function ionicForms() {
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
      '<form id="signinViaSmsForm" class="signin-form signin-via-sms" ng-submit="signinViaSms();" novalidate>',
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

    this.create = function(type) {
      return forms[type] || '<div></div>';
    }
  }

})(window.angular, window.debug);
