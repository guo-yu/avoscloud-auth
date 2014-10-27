;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  var debug = debug('ionic-form');

  angular
    .module('avoscloud-auth')
    .service('avoscloud-ionic-form', ionicForms);

  function ionicForms() {
    var forms = {};

    forms.signup = [
      '<form id="signupForm" class="signup-form" ng-submit="signup();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">用户名</span>',
            '<input type="text" ng-model="user.username" placeholder="">',
          '</label>',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">密码</span>',
            '<input type="password" ng-model="user.password" placeholder="********">',
          '</label>',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">确认密码</span>',
            '<input type="password" ng-model="passwordConfirm" placeholder="********">',
          '</label>',
          '<button class="button button-full button-positive" type="submit">注册</button>',
        '</div>',
      '</form>'
    ].join('\n');

    forms['signup-sms'] = [
      '<form id="signupForm" class="signup-form" ng-submit="signup();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">手机</span>',
            '<input type="text" ng-model="user.username" placeholder="">',
          '</label>',
          '<label class="item item-input item-stacked-label" ng-show="smsSent">',
            '<span class="input-label">验证码</span>',
            '<input type="text" ng-model="smsCode" placeholder="">',
          '</label>',
          '<button class="button button-full button-positive" type="submit">注册</button>',
        '</div>',
      '</form>'
    ].join('\n');

    forms.signin = [
      '<form id="signinForm" class="signin-form" ng-submit="signin();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">用户名</span>',
            '<input type="text" ng-model="user.username" placeholder="">',
          '</label>',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">密码</span>',
            '<input type="password" ng-model="user.password" placeholder="********">',
          '</label>',
          '<button class="button button-full button-positive" type="submit">登录</button>',
        '</div>',
      '</form>'
    ].join('\n');

    forms['signin-sms'] = [
      '<form id="signinViaSmsForm" class="signin-form signin-via-sms" ng-submit="signin();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">手机</span>',
            '<input type="text" ng-model="mobilePhoneNumber" placeholder="">',
          '</label>',
          '<label class="item item-input item-stacked-label" ng-show="smsSent">',
            '<span class="input-label">验证码</span>',
            '<input type="text" ng-model="smsCode" placeholder="">',
          '</label>',
          '<button class="button button-full button-positive" type="submit">登录</button>',
        '</div>',
      '</form>'
    ].join('\n');

    forms['signin-via-mobile'] = [
      '<form id="signinViaMobileForm" class="signin-form signin-via-sms" ng-submit="signin();" novalidate>',
        '<div class="list">',
          '<label class="item item-input item-stacked-label">',
            '<span class="input-label">手机</span>',
            '<input type="text" ng-model="mobilePhoneNumber" placeholder="">',
          '</label>',
          '<label class="item item-input item-stacked-label" ng-show="smsSent">',
            '<span class="input-label">密码</span>',
            '<input type="password" ng-model="password" placeholder="">',
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
