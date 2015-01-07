angular.module('GoaHack')
  .controller('UpdateProfileCtrl', function($scope, $rootScope, User, $alert, $location) {
  
    $scope.skill = [String];
  
     User.get({ uslug: $rootScope.currentUser.slug },              
      function(user)
        {
//          $scope.user = user;
          $scope.name = user.profile.name;
          $scope.nameFull = user.profile.nameFull;
          $scope.employers = user.profile.employers;
          $scope.location = user.profile.location;
          $scope.website = user.profile.website;
          $scope.experience = user.profile.experience;
          $scope.occupation = user.profile.occupation;
          $scope.skill = user.profile.skills;
          console.log(user);
        });
  console.log($rootScope.currentUser.slug);
  console.log($scope.skill);
  //$scope.employers=$scope.user.profile.employers;
  $scope.update = function()
  {
//    $("input").tagsinput('items');
    User.update({name : $scope.name,
                nameFull: $scope.nameFull,
                employers: $scope.employers,
                location: $scope.location,
                website: $scope.website,
                experience: $scope.experience,
                occupation: $scope.occupation,
                skills: $scope.skill
                });

  }

});