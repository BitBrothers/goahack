angular.module('GoaHack')
  .controller('NavbarCtrl', function($scope, Auth) {
    $scope.logout = function() {
      Auth.logout();
    };
  });