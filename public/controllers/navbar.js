angular.module('GoaHack')
<<<<<<< Updated upstream
  .controller('NavbarCtrl', function($scope, Auth, $rootScope) {
=======
  .controller('NavbarCtrl', function($scope,$rootScope, Auth) {
>>>>>>> Stashed changes
    $scope.logout = function() {
      Auth.logout();

    };
    console.log($rootScope.currentUser);
  });