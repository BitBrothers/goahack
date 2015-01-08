angular.module('GoaHack')
  .controller('TeamsCtrl', function($scope,Teams, $alert, $location, $http, $routeParams,$window) {
    $scope.teams = Teams.query({eslug:"goa-hack"},
    	function(teams) {
	    angular.forEach(teams, function(value, key) {
	          var fullName = value.name + ' ';
	          angular.forEach(value.tags, function(tag,key){
	          	fullName += tag + ' ';
	          })
	          $scope.teams[key].searchTerm = fullName;
	   });
	});
    console.log($scope.teams);

    $scope.modalShown = false;
  	$scope.toggleModal = function() {
    	$scope.modalShown = !$scope.modalShown;
	}; 
 });