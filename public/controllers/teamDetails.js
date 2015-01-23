angular.module('GoaHack')
  .controller('TeamDetailsCtrl', function($scope, $alert, $location, $http, $routeParams, FileUploader,
    Team, User, Project, $rootScope, $window, Apply, Invite, Approve, Accept, Unjoin, Remove, ngProgress) {
    $scope.admin;
    $scope.team;
    $scope.teamSlug;
    //  $scope.joinButton = true;
    $scope.acceptButton = false;
  var refresh = function(){  
  Team.get({
        tslug: $routeParams.tslug,
        eslug: 'goa-hack'
      },
      function(team) {
        $scope.team = team;
        $scope.name = team.name;
        $scope.admin = team.admin;
        $scope.description = team.description;
        $scope.team.ps_status = team.ps_status;
        $scope.team.problemStatement = team.problemStatement;
        $scope.team.problemStatement.id = team.problemStatement._id;
        $scope.teamSlug = team.slug;
        $scope.eventSlug = team.eventSlug;
        $scope.numberOfMembers = team.members.length;

        $scope.problemName = team.problemStatement.name;
        $scope.problemDescription = team.problemStatement.description;
        $scope.problemTag = team.problemStatement.tags;

        $scope.joinButton = true;
        console.log($scope.team);

        for (var i = 0; i < team.members.length; i++) {
          if ($rootScope.currentUser.profile.slug == team.members[i]._id.profile.slug)
            $scope.joinButton = false;
        }

        for (var i = 0; i < team.appliedMembers.length; i++) {
          if ($rootScope.currentUser.profile.slug == team.appliedMembers[i]._id.profile.slug)
            $scope.joinButton = false;
        }

        for (var i = 0; i < team.inviteMembers.length; i++) {
          if ($rootScope.currentUser.profile.slug == team.inviteMembers[i]._id.profile.slug) {
            $scope.joinButton = false;
            $scope.acceptButton = true;
          }
        }
        if ($rootScope.currentUser.profile.slug == team.admin.profile.slug) {
          $scope.joinButton = false;
          $scope.acceptButton = false;
        }
      }, function(err){
        $location.path('/teams')
        $alert({
          content: 'No such Team',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
    });
}
  refresh();
    User.get({
        uslug: $rootScope.currentUser.profile.slug
      },
      function(user) {

        $scope.user = user;
        $scope.userId = user._id;
      });

    $scope.tabs = [{
      title: 'Applied',
      page: '../views/teamDetails/appliedMembers.html'
    }, {
      title: 'Invited',
      page: '../views/teamDetails/invitedMembers.html'
    }, ];
    $scope.tabs.activeTab = 0;
    $scope.update = function() {

      Project.update({
        tslug: $routeParams.tslug,
        eslug: 'goa-hack'
      }, {
        name: $scope.problemName,
        description: $scope.problemDescription,
        tags: $scope.problemTag,
        id: $scope.team.problemStatement.id
      }, function(err, data) {
        $alert({
          content: "Problem statement was successfuly updated.",
          placement: 'right',
          type: 'success',
          duration: 5
        });
        Team.get({
          tslug: $routeParams.tslug,
          eslug: 'goa-hack'
        }, function(team) {
          $scope.team = team;
          $scope.displayName = team.problemStatement.name;
          $scope.displayDesc = team.problemStatement.description;
          $scope.displayTags = team.problemStatement.tags;
        });

      }, function(data) {
        $alert({
          content: "There was an error please try again later.",
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      });
      $scope.editStatus = false;
    };

    $scope.editStatus = false;

    $scope.edit = function() {
      $scope.editStatus = !$scope.editStatus;
    };

    $scope.editTeam = function() {
      $scope.editTeamStatus = !$scope.editTeamStatus;
    };

    $scope.showModal = false;

    $scope.addMember = function() {
      $scope.showModal = !$scope.showModal;
    };

    $scope.addMemberEmail = function(memberEmail) {
      Invite.update({
        eslug: 'goa-hack',
        tslug: $routeParams.tslug
      }, {
        invite: memberEmail
      }, function(object) {
        if (object) {
          console.log(object);
          $alert({
            content: 'Invited ' + memberEmail + ' to team.',
            placement: 'right',
            type: 'success',
            duration: 5
          });
          $scope.memberEmail = '';
          refresh();
        }
      }, function(object) {
        if (Object) {
          console.log(object);
          $alert({
            content: memberEmail + ' not invited because ' + object.data,
            placement: 'right',
            type: 'danger',
            duration: 5
          });
          $scope.memberEmail = ' ';
        }
      });
    }

    $scope.btn_add = function() {
      if ($scope.txtcomment != '') {
        //        $scope.comment.push($scope.txtcomment);
        pushChat($scope.txtcomment);
        $scope.txtcomment = "";
        Team.get({
          tslug: $routeParams.tslug,
          eslug: 'goa-hack'
        }, function(team) {
          $scope.team = team;
          $scope.team.chat = team.chat;
        });
      }
    };

    var pushChat = function(abc) {
      $http({
        url: '/api/event/goa-hack/team/' + $routeParams.tslug + '/chat',
        method: 'POST',
        data: {
          description: abc
        }
      }).success(function(data, status, headers, config) {


      }).
      error(function(data, status, headers, config) {


      });
    };

    $scope.applyToTeam = function() {
      Apply.update({
        tslug: $routeParams.tslug,
        eslug: 'goa-hack'
      }, {
        _id: $scope.userId
      }, function(object) {
        $scope.joinButton = false;
        $alert({
          content: 'Successfully applied',
          placement: 'right',
          type: 'success',
          duration: 5
        });
      }, function(object){
          $alert({
          content: 'Already part of team',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      });
    };
/*angular-file-upload start*/
    $scope.imageCrop = false;
    $scope.item 
    var uploader = $scope.uploader = new FileUploader({
        url: '/api/event/goa-hack/team/' + $routeParams.tslug + '/upload',
        method: 'PUT',
        headers: {
          Authorization:$window.localStorage.token 
        }
    });
 
    // FILTERS
 
    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          console.log(item);
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          if ('|jpg|png|jpeg|bmp|gif|'.indexOf(type) == -1) {
            $alert({
              content: 'Please select an image file.',
              placement: 'right',
              type: 'danger',
              duration: 5
            });
            return false;
          };
          if (item.size > 500000) {
            $alert({
              content: 'Image cannot be more than 500KB',
              placement: 'right',
              type: 'danger',
              duration: 5
            });
            return false;
          }
          return true;
        }
    });
 
    // CALLBACKS
 
    /**
     * Show preview with cropping
     */
    uploader.onAfterAddingFile = function(item) {
      // $scope.croppedImage = '';
      item.croppedImage = '';
      var reader = new FileReader();
      reader.onload = function(event) {
        $scope.$apply(function(){
          item.image = event.target.result;
        });
      };
      reader.readAsDataURL(item._file);
    };
 
    /**
     * Upload Blob (cropped image) instead of file.
     * @see
     *   https://developer.mozilla.org/en-US/docs/Web/API/FormData
     *   https://github.com/nervgh/angular-file-upload/issues/208
     */
    uploader.onBeforeUploadItem = function(item) {
      var blob = dataURItoBlob(item.croppedImage);
      item._file = blob;
    };
 
    /**
     * Converts data uri to Blob. Necessary for uploading.
     * @see
     *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     * @param  {String} dataURI
     * @return {Blob}
     */
    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };
 
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        $scope.imageCrop = !$scope.imageCrop;
        console.info('onAfterAddingAll', addedFileItems[0]._file.size);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      $alert({
        content: "Your image was successfuly updated.",
        placement: 'right',
        type: 'success',
        duration: 5
      });
      $scope.imageCrop = !$scope.imageCrop;
      $scope.team.teamPic = response.team.teamPic + '?decache='+Math.floor(Math.random()*1000);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
      $alert({
        content: "There was an error please try again later.",
        placement: 'right',
        type: 'danger',
        duration: 5
      });
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };
 
    console.info('uploader', uploader);
 

/*angular-file-upload end*/


    $scope.acceptTeam = function() {
      console.log("HEllo");
      Accept.update({
        tslug: $routeParams.tslug,
        eslug: 'goa-hack'
      }, {
        result: 'true'
      }, function(object) {
        $alert({
          content: 'Joined team.',
          placement: 'right',
          type: 'success',
          duration: 5
        });
        $scope.acceptButton = false;
        console.log("Hello, accepted");
        console.log($scope.acceptButton);
        refresh();
        console.log('I ran');
      }, function(object) {
//        $scope.acceptButton = false;
        $alert({
          content: 'Failed: ' + object.data,
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      });
    };

    $scope.rejectTeam = function() {
      console.log('Reached Reject');
      Accept.update({
        tslug: $routeParams.tslug,
        eslug: 'goa-hack'
      }, {
        result: 'false'
      }, function(object) {
        $scope.acceptButton = false;
        $scope.joinButton = true;
        $alert({
          content: 'Declined team.',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
        console.log("Hello, rejected");
      }, function(object) {
        $scope.acceptButton = false;
        $alert({
          content: object.data,
          placement: 'right',
          type: 'warning',
          duration: 5
        });
      });
    };

    $scope.approveMember = function(uslug) {
      console.log(uslug);
      Approve.update({
          tslug: $routeParams.tslug,
          eslug: 'goa-hack'
        }, {
          result: 'true',
          approval: uslug
        },
        function(object) {
          $alert({
            content: 'Added to team.',
            placement: 'right',
            type: 'success',
            duration: 5
          });
        refresh();
        },
        function(object) {
          $scope.acceptButton = false;
          $alert({
            content: 'Failed: ' + object.data,
            placement: 'right',
            type: 'danger',
            duration: 5
          });
        });
    };

    $scope.disproveMember = function(uslug) {
      Approve.update({
          tslug: $routeParams.tslug,
          eslug: 'goa-hack'
        }, {
          result: 'false',
          approval: uslug
        },
        function(object) {
          $alert({
            content: 'Added to team.',
            placement: 'right',
            type: 'success',
            duration: 5
          });
        refresh();
        },
        function(object) {
          $scope.acceptButton = false;
          $alert({
            content: object.data,
            placement: 'right',
            type: 'danger',
            duration: 5
          });
        refresh();
        });
    };

    $scope.removeMemberModal = function(uslug) {
      $scope.removeSlug = uslug;
      $scope.removeModal = true
    }

    $scope.deleteTeamModal = function() {
      $scope.deleteModal = true;
    }

    $scope.closeModal = function() {
      $scope.removeModal = false;
      $scope.deleteModal = false;
    }

    $scope.removeMember = function() {
      console.log('Reached Remove');
      Remove.update({
        eslug: 'goa-hack',
        tslug: $routeParams.tslug
      }, {
        remove: $scope.removeSlug
      }, function(object) {
        $alert({
          content: object.message,
          placement: 'right',
          type: 'success',
          duration: 5
        });
        refresh();
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

    $scope.leaveTeam = function() {
      console.log('Reached Leave');
      Unjoin.update({
        eslug: 'goa-hack',
        tslug: $routeParams.tslug
      }, {
        _id: $scope.userId
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

    $scope.deleteTeam = function() {
      Team.delete({
        eslug: 'goa-hack',
        tslug: $routeParams.tslug
      }, {
        _id: $scope.userId
      }, function(object) {
        $alert({
          content: object.message,
          placement: 'right',
          type: 'success',
          duration: 5
        });
        $location.path('/teams');
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
  });