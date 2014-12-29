angular.module('GoaHack')
  .controller('SignupCtrl', function($scope, Auth) {
    $scope.signup = function() {
      Auth.signup({
        name: $scope.displayName,
        email: $scope.email,
        password: $scope.password,
        phoneNo: $scope.phoneNo
      });
    };
    $scope.pageClass = 'fadeZoom';
    $scope.phoneNumberPattern = (function() {
      var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
      return {
          test: function(value) {
              if( $scope.requireTel === false ) return true;
              else return regexp.test(value);
          }
      };
    })();
  });