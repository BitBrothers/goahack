angular.module('GoaHack')
  .controller('UserProfileCtrl', function($scope, $routeParams, $rootScope, User, $alert, $location, $window, $http, Unjoin) {

    //  $scope.user=User.get(uslug='fonz1419948971335');

    var init = function() {
      User.get({
          uslug: $routeParams.slug
        },
        function(user) {
          $scope.user = user;
          console.log(user);

        }, function(err){
          $location.path('/')
          $alert({
            content: 'No such User',
            placement: 'right',
            type: 'danger',
            duration: 5
        });
      });
    };

    init();

    if ($rootScope.currentUser.profile.slug == $routeParams.slug) {

      console.log("hELLO");
      $scope.tabs = [{
        title: 'Team',
        page: '../views/userProfile/team.html'
      }, {
        title: 'Applied',
        page: '../views/userProfile/applied.html'
      }, {
        title: 'Invited',
        page: '../views/userProfile/invited.html'
      }, {
        title: 'Notifications',
        page: '../views/userProfile/applied.html'
      }];
      $scope.tabs.activeTab = 0;

      $scope.editIcon = true;
    } else {
      $scope.tabs = [{
        title: 'Team',
        page: '../views/userProfile/team.html'
      }, ];
      $scope.tabs.activeTab = 0;

      $scope.editIcon = false;
    }


    $scope.path = $location.path();
    console.log($scope.path);

    if ($rootScope.currentUser.slug == $routeParams.slug) {

    } else {

    }

    $scope.progressModal = true;

    $scope.leaveTeamModal = function(abc) {
      $scope.leaveModal = true;
      $scope.leaveSlug = abc;
    };

    $scope.closeModal = function() {
      $scope.leaveModal = false;
    };

    $scope.leaveTeam = function() {
      console.log('Reached Leave');
      Unjoin.update({
        eslug: 'goa-hack',
        tslug: $scope.leaveSlug
      }, {
        _id: $scope.user._id
      }, function(object) {
        $alert({
          content: object.message,
          placement: 'right',
          type: 'success',
          duration: 5
        });
      }, function(object) {
        $scope.acceptButton = false;
        $alert({
          content: object.data,
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      });
    };


    User.get({
        uslug: $rootScope.currentUser.profile.slug
      },
      function(user) {
        $scope.user = user;
        $scope.progressData = 2;
        if ($scope.user.profile.picture)
          $scope.progressData++;
        if ($scope.user.profile.nameFull)
          $scope.progressData++;
        if ($scope.user.profile.occupation)
          $scope.progressData++;
        if ($scope.user.profile.location)
          $scope.progressData++;
        if ($scope.user.profile.website)
          $scope.progressData++;
        if ($scope.user.profile.employers)
          $scope.progressData++;
        if ($scope.user.profile.experience)
          $scope.progressData++;
        if ($scope.user.profile.skills)
          $scope.progressData++;

        $scope.progressData = $scope.progressData * 10;
        console.log($rootScope.currentUser);
        console.log($scope.user);
        if ($scope.progressData == 100)
          $scope.progressModal = false;
        if ($routeParams.slug != $scope.user.profile.slug)
          $scope.progressModal = false;
      });


  });