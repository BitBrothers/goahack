angular.module('GoaHack')
  .controller('UserProfileCtrl', function($scope, $routeParams, User, $alert, $location, $window, $http) {
  
//  $scope.user=User.get(uslug='fonz1419948971335');
  
   User.get({ uslug: $routeParams.slug }, function(user)
           {
               $scope.user = user;
           console.log($scope.user);
  });
  
  $scope.tabs = [
    {title:'Team', page: '../views/userProfile/applied.html'},
    {title:'Applied', page: '../views/userProfile/applied.html'},
    {title:'Invited', page: '../views/userProfile/invited.html'},
    {title:'Notifications', page: '../views/userProfile/applied.html'}
  ];
  $scope.tabs.activeTab = 0;
  console.log($scope.tabs);
//  console.log($rootScope.currentUser);
  
 
  
  console.log($window.localStorage.token);
  
});
