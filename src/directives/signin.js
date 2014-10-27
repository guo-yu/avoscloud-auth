;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  var debug = debug('avoscloud:signin');

  angular
    .module('avoscloud-auth')
    .directive('avoscloudSignin', [
      'avoscloud', 
      'avoscloudAuth', 
      'avoscloud-ionic-form', 
      signIn
    ])
    .directive('avoscloudSigninSms', [
      'avoscloud', 
      'avoscloudAuth', 
      'avoscloud-ionic-form',
      signInViaSms
    ])
    .directive('avoscloudSigninMobile', [
      'avoscloud', 
      'avoscloudAuth', 
      'avoscloud-ionic-form',
      signinViaMobile
    ]);

  function signIn(db, auth, forms) {
    var directive = {
      restrict: 'AE',
      // require: 'ngModel',
      template: forms.create('signin'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;

      function signin() {
        if (!scope.user)
          return auth.signin.error('username is required');
        if (!scope.user.username)
          return auth.signin.error('username is required');
        if (!scope.user.password)
          return auth.signin.error('password is required');

        db.login.post(scope.user, function(result) {
          if (result.sessionToken)
            db.headers('session', result.sessionToken);

          return auth.signin.success(result);
        }, 
          auth.signin.error
        );
      }
    }
  }

  function signInViaSms(db, auth, forms) {
    var directive = {
      restrict: 'AE',
      // require: 'ngModel',
      template: forms.create('signin-sms'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;

      function signin() {
        if (!scope.mobilePhoneNumber)
          return auth.signinSms.error('mobilePhoneNumber is required');
        if (scope.smsSent && !scope.smsCode)
          return auth.signinSms.error('smsCode is required');

        if (!scope.smsSent) {
          return requestSmsCode(function(){
            scope.smsSent = true;
          }, auth.signinSms.error);
        }

        db.login.post({
          mobilePhoneNumber: scope.mobilePhoneNumber,
          smsCode: scope.smsCode
        }, function(result) {
          if (result.sessionToken)
            db.headers('session', result.sessionToken);

          return auth.signinSms.success(result);
        }, 
          auth.signinSms.error
        );
      }

      function requestSmsCode(successCallback, failCallback) {
        db.requestLoginSmsCode.post({
          mobilePhoneNumber: scope.mobilePhoneNumber
        }, successCallback, failCallback);
      }
    }
  }

  function signinViaMobile(db, auth, forms) {
    var directive = {
      restrict: 'AE',
      // require: 'ngModel',
      template: forms.create('signin-via-mobile'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signin = signin;

      function signin() {
        if (!scope.mobilePhoneNumber)
          return auth.signinViaMobile.error('mobilePhoneNumber is required');
        if (!scope.password)
          return auth.signinViaMobile.error('password is required');

        db.login.post({
          mobilePhoneNumber: scope.mobilePhoneNumber,
          password: scope.password
        }, function(result) {
          if (result.sessionToken)
            db.headers('session', result.sessionToken);

          return auth.signinViaMobile.success(result);
        }, 
          auth.signinViaMobile.error
        );
      }
    }
  }

})(window.angular, window.debug);
