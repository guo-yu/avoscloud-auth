;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  // Inject as a angular module
  angular
    .module('avoscloud-auth', ['avoscloud'])
    .service('avoscloudAuth', avoscloudAuth)
    .service('avoscloud-ionic-form', createForm);

  function avoscloudAuth() {
    var self = this;
    this.events = {};

    this.on = function(event, fn, type) {
      var valid = event && fn && typeof(fn) === 'function';
      if (!valid) return;

      if (type && !this.events[type])
        this.events[type] = {};
      if (type)
        this.events[type][event] = fn;
      else 
        this.events[event] = fn;
    };

    this.emit = function(event, data, type) {
      if (type && self.events[type] && self.events[type][event])
        return self.events[type][event](data);
      if (self.events[event])
        return self.events[event](data);
      return;
    }

    // init shortcuts
    angular.forEach(['signin', 'signup', 'signinSms'], function(item){
      if (!self[item])
        self[item] = {};
      self[item].on = function(event, fn) {
        return self.on(event, fn, item);
      };
      angular.forEach(['error', 'success'], function(type){
        self[item][type] = function(data) {
          if (type === 'error' && typeof(data) === 'string')
            data = new Error(data);
          return self.emit(type, data, item);
        };
      });
    });
  }

  function createForm() {
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
