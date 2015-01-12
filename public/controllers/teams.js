angular.module('GoaHack')
  .controller('TeamsCtrl', function($scope,Teams, Team, $alert, $location, $http, $routeParams, $window) {
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
    //console.log($scope.teams);

    $scope.modalShown = false;
  	$scope.toggleModal = function(members) {
    	$scope.modalShown = !$scope.modalShown;

      $scope.teamMembers = members;
	};
  
    $scope.filter = function(tag) {
      $scope.team = tag;
    };
    
    $scope.createModalShown = false;
  $scope.toggleCreateModal = function() {
    $scope.createModalShown = !$scope.createModalShown;
//    console.log(teamName);
  };
  
  $scope.createTeam = function(teamName) {
    //console.log(teamName);
//    Team.save({
//      name: teamName,
//      eslug: 'goa-hack'
//    });
    $http({
      url : '/api/event/goa-hack/team',
      method : 'POST',
      data : {
        name : teamName
      }
    }).success(function(data, status, headers, config){
          

          $alert({
                content: "Your team was successfuly posted.",
                placement: 'right',
                type: 'success',
                duration: 5
              });
          $location.path('/team/'+ data.team.slug);
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
          return;

    }).error(function(data, status, headers, config){
    
            $alert({
                content: data,
                placement: 'right',
                type: 'danger',
                duration: 5
              });
    });
  };
 });