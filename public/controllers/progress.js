angular.module('GoaHack')
  .controller('ProgressCtrl', function($scope, $alert, $location, $http, Progress) {
  $scope.ready;
  Progress.get(function(data){
    $scope.status = data;
    if($scope.status.team_status && $scope.status.ps_status && $scope.status.payment_status && $scope.status.member_status)
    $scope.ready = true;
  });

  console.log($scope.status);
  
//  $scope.toggle = function () {
//    $scope.status.team_status = true; 
//    $scope.status.ps_status = true; 
//    $scope.status.member_status = true; 
//    $scope.status.payment_status = true; 
//    if($scope.status.team_status && $scope.status.ps_status && $scope.status.payment_status && $scope.status.member_status)
//    $scope.ready = true;
//  };

});