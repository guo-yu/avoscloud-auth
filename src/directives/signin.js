;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  var debug = debug('avoscloud:signin');

  angular
    .module('avoscloud-auth')
    .directive('avoscloudSignin', ['avoscloud', 'avoscloudAuth', 'avoscloud-ionic-form', signIn])
    .directive('avoscloudSigninSms', ['avoscloud', 'avoscloudAuth', 'avoscloud-ionic-form',signInViaSms]);

  function signIn(db, auth, forms) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: forms.create('signin'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;

      function signin() {
        if (!scope.username)
          return auth.signin.error('username is required');
        if (!scope.password)
          return auth.signin.error('password is required');

        db.login.post({
          username: scope.username,
          password: scope.password
        }, function(result) {
          if (result.sessionToken)
            db.headers('session', result.sessionToken);
          return auth.signin.success(result);
        }, auth.signin.error);
      }
    }
  }

  function signInViaSms(avoscloud, auth, forms) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: forms.create('signin-sms'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;

      function requestSmsCode() {
        if (!scope.mobilePhoneNumber)
          return auth.signinSms.error('mobilePhoneNumber is required');

        db.requestLoginSmsCode.post({
          mobilePhoneNumber: scope.mobilePhoneNumber
        }, 
          auth.signinSms.success, 
          auth.signinSms.error
        );
      }

      function signin() {
        if (!scope.mobilePhoneNumber)
          return auth.signinSms.error('no mobilePhoneNumber');
        if (!scope.smsCode)
          return auth.signinSms.error('valid sms code required');

        db.login.get({
          smsCode: scope.smsCode,
          mobilePhoneNumber: scope.mobilePhoneNumber
        }, 
          auth.signinSms.success, 
          auth.signinSms.error
        );
      }
    }
  }

})(window.angular, window.debug);
