angular.module('GoaHack')
  .controller('NavbarCtrl', function($scope,$rootScope, Auth) {

    $scope.logout = function() {
      Auth.logout();

    };
    console.log($rootScope.currentUser);
  });