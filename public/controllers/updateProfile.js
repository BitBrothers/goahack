angular.module('GoaHack')
  .controller('UpdateProfileCtrl', function($scope, $rootScope, User, $alert, $location, $routeParams) {
  
    $scope.skill = [String];
     User.get({ uslug: $routeParams.slug },              
      function(user)
        {
       
          $scope.user = user;
          console.log($scope.user);
        });
  
//  console.log($routeParams.slug);
//  console.log($scope.skill);
  //$scope.employers=$scope.user.profile.employers;
  
  $scope.update = function()
  {
//    $("input").tagsinput('items');
    console.log($scope.user);
//    var temp= $scope.user.profile;
    User.update({
                name : $scope.user.profile.name,
                nameFull: $scope.user.profile.nameFull,
                employers: $scope.user.profile.employers,
                location: $scope.user.profile.location,
                website: $scope.user.profile.website,
                experience: $scope.user.profile.experience,
                occupation: $scope.user.profile.occupation,
                skills: $scope.user.profile.skills
                }
//                 , function(){
//                    $alert({
//                      content: "Success",
//                      placement: 'right',
//                      type: 'success',
//                      duration: 5
//                      });
//                }, function(){
//                  console.log('error');
//                }
                );

  }

});