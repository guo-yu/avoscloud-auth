;(function(angular, debug) {
  'use strict';

  if (!angular)
    throw new Error('avoscloudAuth.init(); angular.js required.');

  var debug = debug('avoscloud:signup');

  angular
    .module('avoscloud-auth')
    .directive('avoscloudSignup', ['avoscloud', 'avoscloudAuth', 'avoscloud-ionic-form', signUp])

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

        // Use mobile phone number as username
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
        }, 
          auth.signup.success, 
          auth.signup.error
        );
      }
    }
  }
})(window.angular, window.debug);
