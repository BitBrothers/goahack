angular.module('GoaHack')
  .controller('UserProfileCtrl', function($scope, $routeParams, $rootScope, User, $alert, $location, $window, $http, Unjoin) {

  if(!$rootScope.currentUser){
      $alert({
        content: "You need to login to view this user",
        placement: 'right',
        type: 'warning',
        duration: 5
      });
      $location.path('/login');
    }else{
    var init = function() {
      User.get({
          uslug: $routeParams.slug
        },
        function(user) {
          $scope.user = user;
        
        $scope.skillLength=user.profile.skills.length;
        $scope.invitedTeamsLength=user.events[0].teamInvites.length;
        $scope.appliedTeamsLength=user.events[0].appliedTeams.length;
        
        
        $scope.displaySkill=false;
        $scope.displayAppliedTeams=false;
        $scope.displayTeamInvites=false;
        
        if($scope.skillLength != 0)
        {
          $scope.displaySkill = true;
        }
        if($scope.appliedTeamsLength != 0)
        {
          $scope.displayAppliedTeams = true;
        }
        if($scope.invitedTeamsLength != 0)
        {
          $scope.displayTeamInvites = true;
        }
        

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


    if ($rootScope.currentUser.slug == $routeParams.slug) {

    } else {

    }

    $scope.progressModal = false;

    $scope.leaveTeamModal = function(abc) {
      $scope.leaveModal = true;
      $scope.leaveSlug = abc;
    };

    $scope.closeModal = function() {
      $scope.leaveModal = false;
    };

    $scope.leaveTeam = function() {
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
        init();
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
        $scope.user1 = user;
        $scope.progressData = 2;
        if ($scope.user1.profile.picture)
          $scope.progressData++;
        if ($scope.user1.profile.nameFull)
          $scope.progressData++;
        if ($scope.user1.profile.occupation)
          $scope.progressData++;
        if ($scope.user1.profile.location)
          $scope.progressData++;
        if ($scope.user1.profile.website)
          $scope.progressData++;
        if ($scope.user1.profile.employers)
          $scope.progressData++;
        if ($scope.user1.profile.experience)
          $scope.progressData++;
        if ($scope.user1.profile.skills)
          $scope.progressData++;

        $scope.progressData = $scope.progressData * 10;
        if($scope.progressData != 100)
          $scope.progressModal = true;
        if ($scope.progressData == 100)
          $scope.progressModal = false;
        if ($routeParams.slug != $scope.user1.profile.slug)
          $scope.progressModal = false;
      });

    }
  });