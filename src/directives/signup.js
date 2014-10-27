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
    .directive('avoscloudSignupByMobilephone', [
      'avoscloud', 
      'avoscloudAuth', 
      'avoscloud-ionic-form', 
      avoscloudSignupByMobilephone
    ])

  function signUp(db, auth, forms) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: forms.create('signup'),
      link: link
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.signup = signup;
      scope.verifyMobilePhone = verifyMobilePhone;

      function signup() {
        debug(scope);

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

        var baby = new db.users(scope.user);
        baby.$save(auth.signup.success, auth.signup.error);
      }

      function verifyMobilePhone() {
        if (!scope.smsCode)
          return scope.alert('请输入短信验证码!');

        var code = new db.verifyMobilePhone();

        code.$save({
          code: scope.smsCode
        }, 
          auth.signup.success, 
          auth.signup.error
        );
      }
    }
  }

  function avoscloudSignupByMobilephone(db, auth, forms) {
    var directive = {
      restrict: 'AE',
      require: 'ngModel',
      template: forms.create('signup'),
      link: link
    };
    return directive;

     function link(scope, element, attrs, ctrl) {
      scope.signup = signup;
      scope.verifyMobilePhone = verifyMobilePhone;

      function signup() {
        debug(scope);

        if (!scope.user)
          return auth.signup.error('invalid user params');
        if (!scope.user.mobilePhoneNumber)
          return auth.signup.error('invalid mobilePhoneNumber');
        if (!scope.user.password)
          return auth.signup.error('invalid user params');
        if (!scope.passwordConfirm)
          return auth.signup.error('invalid user params');
        if (scope.user.password !== scope.passwordConfirm)
          return auth.signup.error('passwords are not match');

        // Use mobile phone number as username
        scope.user.username = scope.user.mobilePhoneNumber;

        var baby = new db.users(scope.user);
        baby.$save(auth.signup.success, auth.signup.error); 
      }

      function verifyMobilePhone() {
        if (!scope.smsCode)
          return scope.alert('请输入短信验证码!');

        var code = new db.verifyMobilePhone();

        code.$save({
          code: scope.smsCode
        }, 
          auth.signup.success, 
          auth.signup.error
        );
      }
    }
  }
})(window.angular, window.debug);
