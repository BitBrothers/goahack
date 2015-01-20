angular.module('GoaHack')
  .controller('TeamDetailsCtrl', function($scope, $alert, $location, $http, $routeParams, $upload,
    Team, User, Project, $rootScope, $window, Apply, Invite, Approve, Accept, Unjoin, Remove, ngProgress) {
    $scope.admin;
    $scope.team;
    $scope.teamSlug;
    //  $scope.joinButton = true;
    $scope.acceptButton = false;
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

        $scope.problem.name = team.problemStatement.name;
        $scope.problem.description = team.problemStatement.description;
//        $scope.problem.tag = team.problemStatement.tags;

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
        console.log($rootScope.currentUser.profile.slug);
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
        name: $scope.problem.name,
        description: $scope.problem.description,
        tags: $scope.problem.tag,
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
          $scope.memberEmail = ' ';
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
      });
    };

    $scope.$watch('files', function() {
      // for (var i = 0; i < $scope.files.length; i++) {
      if ($scope.files[0].size > 500000) {
        $alert({
          content: 'Image cannot be more than 500KB',
          placement: 'right',
          type: 'danger',
          duration: 5
        });
      } else {
        var file = $scope.files[0];
        $scope.upload = $upload.upload({
          url: '/api/event/goa-hack/team/' + $routeParams.tslug + '/upload', // upload.php script, node.js route, or servlet url
          method: 'PUT',
          //headers: {'Authorization': 'xxx'}, // only for html5
          //withCredentials: true,
          //data: {myObj: $scope.myModelObj},
          file: file, // single file or a list of files. list is only for html5
          //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
          //fileFormDataName: myFile, // file formData name ('Content-Disposition'), server side request form name
          // could be a list of names for multiple files (html5). Default is 'file'
          //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData. 
          // See #40#issuecomment-28612000 for sample code
        }).progress(function(evt) {
          ngProgress.start();
          console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
        }).success(function(data, status, headers, config) {
          // file is uploaded successfully
          ngProgress.complete();
          console.log('file ' + config.file.name + ' has uploaded successfully. Response: ' + data.message);
          $alert({
            content: "Your image was successfuly updated.",
            placement: 'right',
            type: 'success',
            duration: 5
          });
//          $scope.team = data.team;
          console.log(data.team.teamPic);
          $scope.team.teamPic = data.team.teamPic + '?decache='+Math.floor(Math.random()*1000);
        }).error(function(data, status, headers, config) {
          console.log(data);
          $alert({
            content: "There was an error please try again later.",
            placement: 'right',
            type: 'danger',
            duration: 5
          });
        });
        //.error(...)
        //.then(success, error, progress); // returns a promise that does NOT have progress/abort/xhr functions
        //.xhr(function(xhr){xhr.upload.addEventListener(...)}) // access or attach event listeners to 
        //the underlying XMLHttpRequest
        // }
        /* alternative way of uploading, send the file binary with the file's content-type.
           Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
           It could also be used to monitor the progress of a normal http post/put request. 
           Note that the whole file will be loaded in browser first so large files could crash the browser.
           You should verify the file size before uploading with $upload.http().
        */
        // $scope.upload = $upload.http({...})  // See 88#issuecomment-31366487 for sample code.
      };
    });

    $scope.acceptTeam = function() {
      console.log("HEllo");
      Accept.update({
        tslug: $routeParams.tslug,
        eslug: 'goa-hack'
      }, {
        result: 'true'
      }, function(object) {
        $scope.acceptButton = false;
        $alert({
          content: 'Joined team.',
          placement: 'right',
          type: 'success',
          duration: 5
        });
      }, function(object) {
        $scope.acceptButton = false;
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
      }, function(object) {
        $scope.acceptButton = false;
        $alert({
          content: 'Declined Team',
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
        },
        function(object) {
          $scope.acceptButton = false;
          $alert({
            content: object.data,
            placement: 'right',
            type: 'danger',
            duration: 5
          });
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