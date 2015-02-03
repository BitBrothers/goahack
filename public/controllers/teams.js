angular.module('GoaHack')
  .controller('TeamsCtrl', function($scope, Teams, Team, $alert, $location, $http, $routeParams, $window, $rootScope) {
    $scope.teams = Teams.query({
        eslug: "goa-hack"
      },
      function(teams) {
        angular.forEach(teams, function(value, key) {
          var fullName = value.name + ' ';
          angular.forEach(value.tags, function(tag, key) {
            fullName += tag + ' ';
          })
          $scope.teams[key].searchTerm = fullName;
        });
      });
    $scope.filterHtml = function(user) {
      return /\<(.*?)\>/.test(user.type);
    };
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
      if($rootScope.currentUser)
        $scope.createModalShown = !$scope.createModalShown;
      else
        $alert({
          content: "You need to login to create a team",
          placement: 'right',
          type: 'warning',
          duration: 5
        });
    };

    $scope.createTeam = function(teamName) {
      //    Team.save({
      //      name: teamName,
      //      eslug: 'goa-hack'
      //    });
      $http({
        url: '/api/event/goa-hack/team',
        method: 'POST',
        data: {
          name: teamName
        }
      }).success(function(data, status, headers, config) {


        $alert({
          content: "Your team was successfuly posted.",
          placement: 'right',
          type: 'success',
          duration: 5
        });
        $location.path('/team/' + data.team.slug);
        $scope.teams = Teams.query({
            eslug: "goa-hack"
          },
          function(teams) {
            angular.forEach(teams, function(value, key) {
              var fullName = value.name + ' ';
              angular.forEach(value.tags, function(tag, key) {
                fullName += tag + ' ';
              })
              $scope.teams[key].searchTerm = fullName;
            });
          });
        return;

      }).error(function(data, status, headers, config) {

        $alert({
          content: data,
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      });
    };
  
    $scope.memberNavigate = function(uslug){
      if($rootScope.currentUser){
        $location.path('/userprofile/' + uslug);
      }
      else
        $alert({
          content: "You need to login to view users",
          placement: 'right',
          type: 'warning',
          duration: 5
        });
    };
  
    $scope.teamNavigate = function(tslug){
      if($rootScope.currentUser){
        $location.path('/team/' + tslug);
      }
      else
        $alert({
          content: "You need to login to view this team",
          placement: 'right',
          type: 'warning',
          duration: 5
        });
    };
  
});
    
angular.module('GoaHack').filter('filterHtml', function() {
  return function(input) {
    if (!input) {
      return input;
    };
    var regex = /\<(.*?)\>/ig,
      result = input.replace(regex, "");
    return result;
  };
});