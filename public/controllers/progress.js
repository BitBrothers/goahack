angular.module('GoaHack')
  .controller('ProgressCtrl', function($scope, $alert, $location, $http, Progress) {
  $scope.ready;
  Progress.get(function(data){
    $scope.status = data;
    if($scope.status.team_status && $scope.status.ps_status && $scope.status.payment_status && $scope.status.member_status)
    $scope.ready = true;
  });
});