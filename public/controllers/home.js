angular.module('GoaHack')
  .controller('HomeCtrl', function($scope, $alert, $location, $http, $rootScope) {

  $scope.register = function (){
    $location.path('/signup');
  }
  
  $scope.teams = function(){
    $location.path('/teams');
  }
});
