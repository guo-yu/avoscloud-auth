;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  angular
    .module('avoscloud-auth', ['avoscloud'])
    .service('avoscloudAuth', avoscloudAuth);

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

    // Init shortcuts
    angular.forEach([
      'signin', 
      'signup', 
      'signupSms',
      'signinSms', 
      'signinViaMobile'
    ], function(item){
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

})(window.angular, window.debug);
