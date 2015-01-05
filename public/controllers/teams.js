angular.module('GoaHack')
  .controller('TeamsCtrl', function($scope,Teams, $alert, $location, $http, $routeParams,$window) {
    $scope.teams = Teams.query({eslug:"goa-hack"});
    console.log($scope.teams);

    $scope.modalShown = false;
  	$scope.toggleModal = function() {
    	$scope.modalShown = !$scope.modalShown;
	}; 
 });