angular.module('GoaHack')
  .controller('TeamDetailsCtrl', function($scope, $alert, $location, $http) {
    $scope.problemSubmit = function() 
    {
       console.log($scope.problem.name);
       console.log($scope.problem.description);
       console.log($scope.problem.tag);
       
    };
    
    $scope.problemSubmit = function() 
    {
       console.log($scope.commentArea) 
    };
    
    $scope.lTags = ["warren" , "sobin" , "orville"];
      $scope.loadTags = function(query) {
        console.log($scope.lTags);
        return $http.get('tags.json');
      };

});
