angular.module('GoaHack')
  .controller('TeamDetailsCtrl', function($scope, $alert, $location, $http, $routeParams, Team, $rootScope, $window) {
  
  $scope.admin;
  
  var init = function(){
    Team.get({tslug: $routeParams.tslug, eslug: 'goa-hack'},
      function(team)
        {
          $scope.team = team;
          console.log(team);
          $scope.name = team.name;
          $scope.admin = team.admin;
      
      console.log($rootScope.currentUser._id + " " + $scope.admin + " " + $scope.editProblemStatementIcon);
        });
  };
  
  init();
  
    

        console.log($scope.admin);
        console.log($rootScope.currentUser._id);
        $scope.tabs = [
          {title:'Applied', page: '../views/teamDetails/appliedMembers.html'},
          {title:'Invited', page: '../views/teamDetails/invitedMembers.html'},
        ];
       
        $scope.tabs.activeTab = 0;
        console.log($scope.tabs);
        
        
  
    $scope.problemSubmit = function() 
    {
       console.log($scope.problem.name);
       console.log($scope.problem.description);
       console.log($scope.problem.tag);
       
    };
    
    $scope.problemSubmit = function() 
    {
       console.log($scope.commentArea); 
    };
    
    $scope.lTags = ["warren" , "sobin" , "orville"];
    $scope.loadTags = function(query) {
        console.log($scope.lTags);
        return $http.get('tags.json');
    };
  
  
        $scope.editStatus = false;

    
  $scope.edit = function(){
    console.log('click');
        $scope.editStatus = !$scope.editStatus;

  }
    

 
  
//  console.log($routeParams.tslug);
  
//  $scope.name = $routeParams.tslug;
//  console.log($scope.name);

});
