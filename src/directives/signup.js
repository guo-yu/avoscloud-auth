;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  var debug = debug('avoscloud:signup');

  angular
    .module('avoscloud-auth')
    .directive('avoscloudSignup', [
      'avoscloud', 
      'avoscloudAuth', 
      'avoscloud-ionic-form', 
      signUp
    ])
    .directive('avoscloudSignupSms', [
      'avoscloud', 
      'avoscloudAuth', 
      'avoscloud-ionic-form', 
      '$timeout',
      avoscloudSignupSms
    ])

  function signUp(db, auth, forms) {
    var directive = {
      restrict: 'AE',
      // require: 'ngModel',
      template: forms.create('signup'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signup = signup;

      function signup() {
        debug(scope);

        if (!scope.user)
          return auth.signup.error('invalid user params');
        if (!scope.user.username)
          return auth.signup.error('invalid username params');
        if (!scope.user.password)
          return auth.signup.error('invalid password params');
        if (!scope.passwordConfirm)
          return auth.signup.error('invalid passwordConfirm params');
        if (scope.user.password !== scope.passwordConfirm)
          return auth.signup.error('passwords are not match');

        var baby = new db.users(scope.user);
        baby.$save(
          function(result) {
            if (result.sessionToken)
              db.headers('session', result.sessionToken);

            return auth.signup.success(result);
          }, 
          auth.signup.error
        );
      }
    }
  }

  function avoscloudSignupSms(db, auth, forms, $timeout) {
    var directive = {
      restrict: 'AE',
      // require: 'ngModel',
      template: forms.create('signup-sms'),
      link: link
    };
    return directive;

     function link(scope, element, attrs, ctrl) {
      scope.signup = signup;
      scope.resendCode = resendCode;

      function signup() {
        if (!scope.mobilePhoneNumber)
          return auth.signupSms.error('invalid mobilePhoneNumber');

        if (scope.smsSent) {
          if (!scope.smsCode)
            return auth.signupSms.error('invalid smsCode');

          return verifyMobilePhone();
        }

        scope.user = {};
        scope.user.username = scope.mobilePhoneNumber;
        scope.user.mobilePhoneNumber = scope.mobilePhoneNumber;
        scope.user.password = ((new Date()).getTime() + (Math.random() * 10)).toString();

        var baby = new db.users(scope.user);

        baby.$save(
          function(result) {
            debug(result);
            scope.smsSent = true;

            countDown(60);

            if (result.sessionToken)
              db.headers('session', result.sessionToken);
          }, 
          auth.signupSms.error
        ); 
      }

      function countDown(num) {
        if (num === 0) {
          scope.resendCodeDisabled = false;
          scope.resendCodeText = '重发验证短信';
          return;
        }

        if (!scope.resendCodeDisabled)
          scope.resendCodeDisabled = true;

        scope.resendCodeText = num;
        num --;

        $timeout(function(){
          countDown(num);
        }, 1000);
      }

      function resendCode() {
        db.requestMobilePhoneVerify.post({
          mobilePhoneNumber: scope.user.mobilePhoneNumber
        }, function(result){
          debug(result);
          countDown(60);
        }, function(err){
          debug(err);
        });
      }

      function verifyMobilePhone() {
        var code = new db.verifyMobilePhone();

        code.$save({
          code: scope.smsCode
        }, 
          auth.signupSms.success, 
          auth.signupSms.error
        );
      }
    }
  }
})(window.angular, window.debug);
