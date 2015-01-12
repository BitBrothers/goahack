angular.module('GoaHack')
  .controller('NavbarCtrl', function($scope, Auth, $rootScope) {
    $scope.logout = function() {
      Auth.logout();
    };
  });